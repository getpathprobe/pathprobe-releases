# PathProbe — release downloads

PathProbe is a **command-line network test tool**. It has **no graphical interface**; every feature runs from a terminal (Linux shell or an Administrator Command Prompt / PowerShell on Windows).

This repository contains **release binaries and documentation only**. Source code is not published here.

Website: https://getpathprobe.com · Support: service@getpathprobe.com

## Download

Get the latest version from the [Releases page](https://github.com/getpathprobe/pathprobe-releases/releases/latest).

| Platform | File |
|---|---|
| Debian/Ubuntu x86_64 | `pathprobe_1.2.2_amd64.deb` |
| Debian/Ubuntu arm64 / Raspberry Pi | `pathprobe_1.2.2_arm64.deb` |
| Linux x86_64 (generic) | `pathprobe-1.2.2-linux-amd64.tar.gz` |
| Linux arm64 / Raspberry Pi | `pathprobe-1.2.2-linux-arm64.tar.gz` |
| Windows 10/11 x64 portable | `PathProbe-1.2.2-windows-amd64.zip` |

## Install

**Debian / Ubuntu**
```sh
sudo apt install ./pathprobe_1.2.2_amd64.deb
pathprobe --help
```

**Other Linux**
```sh
tar xzf pathprobe-1.2.2-linux-amd64.tar.gz
sudo install pathprobe-1.2.2-linux-amd64/pathprobe /usr/local/bin/
pathprobe --help
```
Raw-socket features need root, or `sudo setcap cap_net_raw,cap_net_admin+ep $(command -v pathprobe)`.

**Windows**
Unzip `PathProbe-1.2.2-windows-amd64.zip`. Then open an **Administrator** Command Prompt and run `pathprobe --help`.
DHCP simulation, scan and capture require [Npcap](https://npcap.com/#download) installed in "WinPcap API-compatible Mode" (not bundled). The installer and binaries are not code-signed yet, so SmartScreen may warn.

## Verify checksums
```sh
sha256sum -c SHA256SUMS --ignore-missing
```
Windows PowerShell: `Get-FileHash .\PathProbe-1.2.2-windows-amd64.zip -Algorithm SHA256` and compare with `SHA256SUMS`.

## What's new in 1.2.2
Inline tap (Pro, Linux and Raspberry Pi only; not in the Windows build): `pathprobe tap` bridges two USB NICs into a transparent bridge with no IP address, captures to pcapng or streams live to Wireshark, and `tap reset` restores the NICs. Guide with the connection diagram and commands: https://getpathprobe.com/tap-guide.html (also `TAP-GUIDE.md` in every package).

## Also in 1.2.1
The run log now keeps full MAC and IP addresses so you can see your own results later. The new free `pathprobe log share` command writes a scrubbed copy (MACs and real IPs removed; 192.0.2.x-style documentation addresses kept) for support tickets and forum posts. License keys, passwords, and webhook/ntfy URLs are never saved in the log, including webhook URLs passed to `schedule install --webhook`.

Also in 1.2: `dhcp run` JSON/NDJSON output, a run log, an MCP server for AI agents, scheduled profile runs with ntfy and webhook alerts, NetBox/Nautobot inventory, and CLI polish. Pro includes live `dhcp run --json` events, the new `--json` on target/static/dhcp release/stop/profile, MCP, and scheduled alerts. Free includes the nine JSON commands from 1.1.3, the dhcp run final summary, the run log, and inventory. 1.1.3 seats stay Pro on the same computer; a 1.1.2 key needs a one-time online activation.

## Free vs Pro
- **Free ($0):** all core commands (DHCP, interfaces, env, scan, link, internet, whoami, traceroute, static addressing, and target); DHCP simulation up to 5 clients; none or a single 802.1Q tag; packet capture (pcapng); core RFC/IEEE standards checks; JSON on interfaces, env, link, internet, whoami, traceroute, scan, dhcp status, and license status; the dhcp run final summary; the run log; NetBox/Nautobot inventory; examples command.
- **Pro ($9.99 one-time):** everything in Free, plus up to 1,000 DHCP clients, QinQ (stacked VLAN tags), saved profiles with export, extra standards checks, live `dhcp run --json` events, `--json` on target/static/dhcp release/stop/profile, the MCP server, and scheduled runs with alerts. One license = one computer, non-transferable (one-time online activation: `pathprobe license activate --key PP1....`).

Buy Pro at https://getpathprobe.com/#pricing (Paddle checkout).

## Documentation
`README` and `EXAMPLES` are included in each download and installed with the packages.
Watch the tutorials on YouTube: https://www.youtube.com/@BeenThere.BuiltThat

## Responsible use
Only use PathProbe on networks you own or are authorized to test.

## License
Proprietary; see [LICENSE](LICENSE). © 2026 PathProbe.
