/* Client-side only. No network calls. Safe to run in the browser or in Node tests. */
(function (root) {
  "use strict";

  var OPTION_NAMES = {
    0: "Pad",
    1: "Subnet Mask",
    2: "Time Offset",
    3: "Router",
    4: "Time Server",
    5: "Name Server",
    6: "Domain Name Server",
    12: "Host Name",
    15: "Domain Name",
    26: "Interface MTU",
    28: "Broadcast Address",
    31: "Perform Router Discovery",
    33: "Static Route",
    42: "NTP Servers",
    43: "Vendor-Specific Information",
    44: "NetBIOS over TCP/IP Name Server",
    50: "Requested IP Address",
    51: "IP Address Lease Time",
    52: "Option Overload",
    53: "DHCP Message Type",
    54: "Server Identifier",
    55: "Parameter Request List",
    56: "Message",
    57: "Maximum DHCP Message Size",
    58: "Renewal Time (T1)",
    59: "Rebinding Time (T2)",
    60: "Vendor Class Identifier",
    61: "Client Identifier",
    66: "TFTP Server Name",
    67: "Bootfile Name",
    82: "Relay Agent Information",
    119: "Domain Search",
    121: "Classless Static Route",
    125: "Vendor-Identifying Vendor-Specific",
    255: "End"
  };

  var MSG_TYPES = {
    1: "Discover",
    2: "Offer",
    3: "Request",
    4: "Decline",
    5: "Ack",
    6: "Nak",
    7: "Release",
    8: "Inform",
    9: "Force Renew"
  };

  function hexByte(n) {
    return (n + 256).toString(16).slice(-2);
  }

  function bytesToHex(bytes) {
    var out = [];
    for (var i = 0; i < bytes.length; i++) out.push(hexByte(bytes[i]));
    return out.join(" ");
  }

  function normalizeHex(input) {
    var s = String(input || "").replace(/0x/gi, " ");
    s = s.replace(/[^0-9a-fA-F]/g, "");
    if (s.length === 0) throw new Error("Paste some hex first.");
    if (s.length % 2 !== 0) throw new Error("Odd number of hex digits — a byte may be missing.");
    var bytes = [];
    for (var i = 0; i < s.length; i += 2) bytes.push(parseInt(s.slice(i, i + 2), 16));
    return bytes;
  }

  function findOptionsStart(bytes) {
    for (var i = 0; i <= bytes.length - 4; i++) {
      if (bytes[i] === 99 && bytes[i + 1] === 130 && bytes[i + 2] === 83 && bytes[i + 3] === 99) {
        return i + 4;
      }
    }
    return 0;
  }

  function ipv4At(bytes, off) {
    if (off + 4 > bytes.length) return null;
    return bytes[off] + "." + bytes[off + 1] + "." + bytes[off + 2] + "." + bytes[off + 3];
  }

  function ipv4List(data) {
    if (data.length % 4 !== 0 || data.length === 0) return null;
    var ips = [];
    for (var i = 0; i < data.length; i += 4) ips.push(ipv4At(data, i));
    return ips.join(", ");
  }

  function u32(data) {
    if (data.length !== 4) return null;
    return ((data[0] << 24) >>> 0) + (data[1] << 16) + (data[2] << 8) + data[3];
  }

  function formatDuration(sec) {
    if (sec == null) return null;
    var d = Math.floor(sec / 86400);
    var h = Math.floor((sec % 86400) / 3600);
    var m = Math.floor((sec % 3600) / 60);
    var s = sec % 60;
    var parts = [];
    if (d) parts.push(d + "d");
    if (h) parts.push(h + "h");
    if (m) parts.push(m + "m");
    if (s || parts.length === 0) parts.push(s + "s");
    return sec + " seconds (" + parts.join(" ") + ")";
  }

  function ascii(data) {
    var ok = true;
    var out = "";
    for (var i = 0; i < data.length; i++) {
      var c = data[i];
      if (c < 32 || c > 126) { ok = false; break; }
      out += String.fromCharCode(c);
    }
    return ok ? out : null;
  }

  function decodeOptionValue(code, data) {
    if (code === 53 && data.length === 1) {
      return (MSG_TYPES[data[0]] || "Unknown") + " (" + data[0] + ")";
    }
    if ((code === 1 || code === 28 || code === 50 || code === 54) && data.length === 4) {
      return ipv4At(data, 0);
    }
    if ((code === 3 || code === 4 || code === 5 || code === 6 || code === 42 || code === 44) && data.length >= 4) {
      return ipv4List(data) || bytesToHex(data);
    }
    if (code === 51 || code === 58 || code === 59) {
      var t = u32(data);
      return t == null ? bytesToHex(data) : formatDuration(t);
    }
    if (code === 26 || code === 57) {
      if (data.length === 2) return ((data[0] << 8) + data[1]).toString();
    }
    if (code === 55) {
      var names = [];
      for (var i = 0; i < data.length; i++) {
        names.push((OPTION_NAMES[data[i]] || "Option") + " (" + data[i] + ")");
      }
      return names.join(", ");
    }
    if (code === 82) {
      return decodeRelay(data);
    }
    if (code === 61 && data.length >= 7 && data[0] === 1) {
      var mac = [];
      for (var m = 1; m < 7; m++) mac.push(hexByte(data[m]));
      return "Ethernet " + mac.join(":");
    }
    var text = ascii(data);
    if (text && (code === 12 || code === 15 || code === 56 || code === 60 || code === 66 || code === 67 || code === 119)) {
      return text;
    }
    if (text && data.length > 0) return text;
    return data.length ? bytesToHex(data) : "—";
  }

  function decodeRelay(data) {
    var parts = [];
    var i = 0;
    while (i < data.length) {
      var sub = data[i++];
      if (i >= data.length) {
        parts.push("truncated sub-option " + sub);
        break;
      }
      var len = data[i++];
      if (i + len > data.length) {
        parts.push("truncated sub-option " + sub);
        break;
      }
      var slice = data.slice(i, i + len);
      i += len;
      var label = sub === 1 ? "Circuit ID" : sub === 2 ? "Remote ID" : "Sub-option " + sub;
      parts.push(label + ": " + (ascii(slice) || bytesToHex(slice)));
    }
    return parts.join("; ") || bytesToHex(data);
  }

  function decodeOptions(input) {
    var bytes = normalizeHex(input);
    var start = findOptionsStart(bytes);
    var usedCookie = start > 0;
    var options = [];
    var i = start;
    var ended = false;
    while (i < bytes.length) {
      var code = bytes[i++];
      if (code === 0) {
        options.push({ code: 0, name: "Pad", length: 0, value: "—", hex: "" });
        continue;
      }
      if (code === 255) {
        options.push({ code: 255, name: "End", length: 0, value: "—", hex: "" });
        ended = true;
        break;
      }
      if (i >= bytes.length) {
        options.push({ code: code, name: OPTION_NAMES[code] || "Unknown", length: null, value: "Truncated: missing length byte", hex: "" });
        break;
      }
      var len = bytes[i++];
      if (i + len > bytes.length) {
        options.push({
          code: code,
          name: OPTION_NAMES[code] || "Unknown",
          length: len,
          value: "Truncated: declared length " + len + " but only " + (bytes.length - i) + " byte(s) left",
          hex: bytesToHex(bytes.slice(i))
        });
        break;
      }
      var data = bytes.slice(i, i + len);
      i += len;
      options.push({
        code: code,
        name: OPTION_NAMES[code] || "Unknown",
        length: len,
        value: decodeOptionValue(code, data),
        hex: bytesToHex(data)
      });
    }
    return {
      usedCookie: usedCookie,
      skippedBytes: start,
      ended: ended,
      leftover: ended && i < bytes.length ? bytes.length - i : 0,
      options: options
    };
  }

  /* Sample: magic cookie + Discover (53=1), param request 1,3,6,15,51, client id, end.
     MAC in option 61 is the documentation address 00:00:5E:00:53:00. */
  var SAMPLE_OPTIONS_HEX =
    "63825363" +
    "350101" +
    "37050103060f33" +
    "3d070100005e005300" +
    "ff";

  function parseIpv4(s) {
    var m = String(s || "").trim().match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
    if (!m) throw new Error("Enter an IPv4 address like 192.0.2.0.");
    var parts = [Number(m[1]), Number(m[2]), Number(m[3]), Number(m[4])];
    for (var i = 0; i < 4; i++) {
      if (parts[i] > 255) throw new Error("Each IPv4 octet must be 0–255.");
    }
    return ((parts[0] << 24) >>> 0) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
  }

  function intToIp(n) {
    n = n >>> 0;
    return [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
  }

  function maskFromCidr(c) {
    c = Number(c);
    if (!Number.isInteger(c) || c < 0 || c > 32) throw new Error("CIDR prefix must be an integer from 0 to 32.");
    if (c === 0) return 0;
    return (0xffffffff << (32 - c)) >>> 0;
  }

  function cidrFromMask(mask) {
    var m = mask >>> 0;
    var cidr = 0;
    var seenZero = false;
    for (var bit = 31; bit >= 0; bit--) {
      if (m & (1 << bit)) {
        if (seenZero) throw new Error("That dotted mask is not contiguous (not a valid prefix mask).");
        cidr++;
      } else {
        seenZero = true;
      }
    }
    return cidr;
  }

  function parseMaskOrCidr(maskStr, cidrStr) {
    var cidrRaw = String(cidrStr || "").trim();
    var maskRaw = String(maskStr || "").trim();
    if (cidrRaw !== "") {
      if (cidrRaw.charAt(0) === "/") cidrRaw = cidrRaw.slice(1);
      var c = Number(cidrRaw);
      return { cidr: c, mask: maskFromCidr(c) };
    }
    if (maskRaw !== "") {
      var mask = parseIpv4(maskRaw);
      return { cidr: cidrFromMask(mask), mask: mask };
    }
    throw new Error("Enter a CIDR prefix (for example 24) or a dotted mask (for example 255.255.255.0).");
  }

  function calculateScope(opts) {
    var ip = parseIpv4(opts.ip);
    var parsed = parseMaskOrCidr(opts.mask, opts.cidr);
    var mask = parsed.mask;
    var cidr = parsed.cidr;
    var network = (ip & mask) >>> 0;
    var broadcast = (network | (~mask >>> 0)) >>> 0;
    var total = cidr === 0 ? 4294967296 : Math.pow(2, 32 - cidr);
    var firstUsable, lastUsable, usableCount;
    if (cidr === 32) {
      firstUsable = lastUsable = network;
      usableCount = 1;
    } else if (cidr === 31) {
      firstUsable = network;
      lastUsable = broadcast;
      usableCount = 2;
    } else {
      firstUsable = (network + 1) >>> 0;
      lastUsable = (broadcast - 1) >>> 0;
      usableCount = Math.max(0, total - 2);
    }
    var gatewayReserve = opts.gatewayReserve == null || opts.gatewayReserve === "" ? 1 : Number(opts.gatewayReserve);
    var extraExclude = opts.extraExclude == null || opts.extraExclude === "" ? 0 : Number(opts.extraExclude);
    if (!Number.isInteger(gatewayReserve) || gatewayReserve < 0) {
      throw new Error("Gateway reserve must be a whole number of 0 or more.");
    }
    if (!Number.isInteger(extraExclude) || extraExclude < 0) {
      throw new Error("Extra exclusions must be a whole number of 0 or more.");
    }

    var poolNote;
    var poolStart = null;
    var poolEnd = null;
    var poolSize = 0;
    if (cidr >= 31) {
      poolNote = "A /" + cidr + " has no spare addresses in the usual 'network + gateway + pool + broadcast' layout. Do not carve a DHCP scope out of this prefix without a specific design (for example a point-to-point /31).";
    } else {
      var start = (firstUsable + gatewayReserve) >>> 0;
      var end = lastUsable;
      if (start > end || gatewayReserve >= usableCount) {
        poolNote = "Too many addresses are reserved for a gateway. Lower the reserve or use a larger prefix.";
      } else {
        var size = (end - start + 1);
        if (extraExclude >= size) {
          poolNote = "Extra exclusions leave no addresses in the pool. Lower the exclusion count.";
        } else {
          end = (end - extraExclude) >>> 0;
          poolStart = start;
          poolEnd = end;
          poolSize = end - start + 1;
          poolNote = "Recommended pool skips the network address, " + gatewayReserve + " address(es) at the start of the usable range (typically a gateway), the broadcast address, and " + extraExclude + " extra exclusion(s) taken from the end of the range. This is a starting point, not a server config.";
        }
      }
    }

    return {
      inputIp: intToIp(ip),
      network: intToIp(network),
      broadcast: intToIp(broadcast),
      mask: intToIp(mask),
      wildcard: intToIp((~mask) >>> 0),
      cidr: cidr,
      prefix: intToIp(network) + "/" + cidr,
      totalAddresses: total,
      usableCount: usableCount,
      firstUsable: intToIp(firstUsable),
      lastUsable: intToIp(lastUsable),
      poolStart: poolStart != null ? intToIp(poolStart) : null,
      poolEnd: poolEnd != null ? intToIp(poolEnd) : null,
      poolSize: poolSize,
      poolNote: poolNote
    };
  }

  function normalizeMac(s) {
    var hex = String(s || "").replace(/[^0-9a-fA-F]/g, "");
    if (!hex) return "";
    if (hex.length !== 12) throw new Error("A MAC address must be 6 bytes (12 hex digits), for example 00:00:5E:00:53:00.");
    var parts = [];
    for (var i = 0; i < 12; i += 2) parts.push(hex.slice(i, i + 2).toLowerCase());
    return parts.join(":");
  }

  function normalizeHexId(s, label) {
    var hex = String(s || "").replace(/0x/gi, "").replace(/[^0-9a-fA-F]/g, "");
    if (!hex) return "";
    if (hex.length % 2) hex = "0" + hex;
    return "0x" + hex.toLowerCase();
  }

  function buildDhcpFilter(opts) {
    var parts = [];
    var types = opts.types || [];
    if (types.length) {
      var typeParts = types.map(function (t) { return "dhcp.option.dhcp == " + t; });
      parts.push(types.length === 1 ? typeParts[0] : "(" + typeParts.join(" || ") + ")");
    }
    if (opts.mac) parts.push("dhcp.hw.mac_addr == " + normalizeMac(opts.mac));
    if (opts.clientIp) parts.push("dhcp.ip.client == " + intToIp(parseIpv4(opts.clientIp)));
    if (opts.serverIp) parts.push("dhcp.ip.server == " + intToIp(parseIpv4(opts.serverIp)));
    if (opts.xid) parts.push("dhcp.id == " + normalizeHexId(opts.xid, "transaction ID"));
    if (opts.vlan) {
      var v = Number(opts.vlan);
      if (!Number.isInteger(v) || v < 1 || v > 4094) throw new Error("VLAN ID must be an integer from 1 to 4094.");
      parts.push("vlan.id == " + v);
    }
    if (opts.bootpPorts) parts.push("(udp.port == 67 || udp.port == 68)");
    if (!parts.length) {
      return { filter: "dhcp", bootp: "bootp", note: "No extras selected — this matches DHCP (or BOOTP, on older Wireshark) traffic." };
    }
    return {
      filter: parts.join(" && "),
      bootp: parts.join(" && ").replace(/dhcp\./g, "bootp."),
      note: "Current Wireshark uses dhcp.* field names. Older releases used bootp.* as an alias. If a field is unknown in your build, try the bootp form or eth.addr for a MAC."
    };
  }

  root.DhcpTools = {
    OPTION_NAMES: OPTION_NAMES,
    MSG_TYPES: MSG_TYPES,
    SAMPLE_OPTIONS_HEX: SAMPLE_OPTIONS_HEX,
    decodeOptions: decodeOptions,
    calculateScope: calculateScope,
    buildDhcpFilter: buildDhcpFilter,
    normalizeMac: normalizeMac,
    intToIp: intToIp,
    parseIpv4: parseIpv4
  };

  if (typeof module !== "undefined" && module.exports) module.exports = root.DhcpTools;
})(typeof globalThis !== "undefined" ? globalThis : this);
