# PathProbe 1.2.2

**PathProbe is a command-line (CLI) tool with no GUI.** Use Command Prompt or PowerShell on Windows and a terminal on Linux.

## What's new in 1.2.2

- **Inline tap (Pro, Linux and Raspberry Pi only).** `pathprobe tap` builds a transparent Linux bridge (`br-tap`, no IP address) between two USB NICs, captures to a pcapng file or streams live pcapng to stdout for Wireshark, and tears the bridge down with `tap reset` (restores each member NIC's pre-bridge flags, including promiscuous mode). The built-in NIC stays on management and is never bridged. Capture uses dumpcap (Debian / Raspberry Pi OS package `wireshark-common`). USB 3 adapters are recommended. This command is not in the Windows build. `tap status` and `tap reset` can be run on the Free tier so you can inspect or clean up a leftover bridge; `tap bridge` and `tap capture` require Pro.
- **Inline tap guide.** A connection diagram and exact commands ship in every package (`TAP-GUIDE.md`, `tap-guide.svg`, `tap-guide.png`) and on the site: https://getpathprobe.com/tap-guide.html. The guide also shows how to apply manual Linux `tc netem` impairment (delay, jitter, loss, duplicate, corrupt, reorder, and rate limit with tbf) on a bridge member port. Netem is a Linux technique, not a PathProbe command yet. Examples use documentation addresses only (`192.0.2.0/24`).

This public release also includes everything that landed after 1.1.2 and had not yet been published as a combined Pro release: the 1.2.0 feature set and the 1.2.1 run-log fixes below.

## Included from 1.2.1

- **Full results in the run log.** The run log keeps MAC addresses and IP addresses by default, so you can look back and see which client got which address. License keys, tokens, passwords, and webhook or ntfy URLs and topics are always redacted. `--no-log` (or `PATHPROBE_NO_LOG=1`) still skips the log.
- **`pathprobe log share` (Free).** Writes a scrubbed copy of the run log for a support ticket or forum post: MACs become `[redacted-mac]` and real IPs become `[redacted-ip]`, while the documentation ranges `192.0.2.0/24`, `198.51.100.0/24`, and `203.0.113.0/24` stay visible. `--hostnames` also hides DNS names, `--last N` keeps only the newest lines, and `--out FILE` writes to a file. `--log-redact` (or `PATHPROBE_LOG_REDACT=1`) scrubs addresses as the log is written.
- **Webhook URLs are no longer saved in the local run log.** A webhook URL passed to `pathprobe schedule install --webhook URL` (and other secret flag values written as `--flag VALUE`) is redacted in the run log and in `log share` output.

## Included from 1.2.0

- `dhcp run` JSON and NDJSON output
- Automatic run log
- MCP server so AI agents can use PathProbe
- Scheduled profile runs with ntfy and webhook alerts (bare ntfy topics are accepted)
- NetBox and Nautobot inventory
- CLI polish
- One purchased license activates on one computer; activating again on that same computer is allowed; a second computer is refused

## Tiers

**Pro:** live `dhcp run --json` events; `--json` on `target`, `static`, `dhcp release`, `dhcp stop`, and `profile`; the MCP server; scheduled runs with alerts; and the inline tap (Linux and Raspberry Pi only).

**Free:** the nine commands that already had `--json` in 1.1.3, the `dhcp run` final summary, the run log, `log share`, inventory, and `tap status` / `tap reset` on Linux.

Licensing, activation, and pricing are unchanged. 1.2.0 and 1.1.3 seats stay Pro on the same computer.

## Upgrade

1.1.3 seats stay Pro on the same computer. A 1.1.2 key needs a one-time online activation:

```
pathprobe license activate --key PP1....
```

The license is then locked to that computer and checked offline. Activating again on the same computer is allowed. A second computer is refused and needs its own license. There is no deactivate or transfer.

Buy Pro: https://getpathprobe.com/#pricing

## Downloads

| File | For |
| --- | --- |
| `pathprobe_1.2.2_amd64.deb` | Ubuntu 22.04 / 24.04, Debian 12 and newer (x64) |
| `pathprobe_1.2.2_arm64.deb` | Ubuntu / Debian and Raspberry Pi OS 64-bit (arm64) |
| `pathprobe-1.2.2-linux-amd64.tar.gz` | Other Linux distributions (x64) |
| `pathprobe-1.2.2-linux-arm64.tar.gz` | Other Linux distributions and Raspberry Pi (arm64) |
| `PathProbe-1.2.2-windows-amd64.zip` | Windows 10/11 x64 (portable; run from an Administrator terminal) |
| `SHA256SUMS` | Checksums |
| `latest.json` | In-app update notice (`{"version":"1.2.2"}`) |
| `TAP-GUIDE.md`, `tap-guide.svg`, `tap-guide.png` | Inline tap guide and diagram (also inside every download) |
| `README.md`, `EXAMPLES.md`, `EXAMPLES.txt`, `DHCP-REFERENCE.md`, `RFC2131.txt`, `LICENSE` | The guide and reference docs (also inside every download) |

Windows needs Npcap (WinPcap API-compatible Mode). The Windows build is not code-signed; SmartScreen may warn. There is no Windows inline tap.

## Checksums (SHA-256)

```
e74f96ab4b6c6cc3730887733fc928f5e74fa18a9ecacffbc0c25f5309233aeb  DHCP-REFERENCE.md
f778bd9915f518d8c99f3d363ec37686ad197743f975bbc2032182d5262aadf9  EXAMPLES.md
5443f1d3044d50caa438e760b964e9d0252ff0d4d1512c04ab9f97c60c4f8089  EXAMPLES.txt
ae6c7f83599459d0128390fb230158a9d78ac272cdd2f93d964c8679aa6f9ecf  LICENSE
b7a732c2d786832d33013d80eb2f74e4c140b22ba299a8bf55ec6232f1bfe0fa  PathProbe-1.2.2-windows-amd64.zip
f0da5df99cf968fe08678d00fb159a39f473a3f832d07b5a96dffb70f3bfcc23  README.md
a043b705785b81762505ded4cf71d61392b2b1da2b4ce1e32c13bc984de5f4a5  RFC2131.txt
8684a2db69d38062704e0cc05c2a884a1a5fe1314912a193625a0cfad48d70fd  TAP-GUIDE.md
fad718d401c2334a4070f2a06766b564cbcaf263c22135734e2016a5d08e217b  latest.json
895c40203999b39de3f7983f5983ac1949f34362932f117a1878d32543f44224  pathprobe-1.2.2-linux-amd64.tar.gz
b25b31f70b515ed3e13d3517d705f100622e603e5feb54c9ffc7a55915bfc204  pathprobe-1.2.2-linux-arm64.tar.gz
ff9fb7afae1c8df91db719e8a33da0fbe22c99895da2c54abc5a57c7bc8b6ecf  pathprobe_1.2.2_amd64.deb
12db05d43c6ee090dfcf3784f87cd1f26495472baa42a07eb2faf2f4f25e1708  pathprobe_1.2.2_arm64.deb
57e43af1d2295941f4e4ae0ed95ea93bb7a143a1b22c6bf2429c641cad6a77ef  tap-guide.png
967563455d6820a550042dd76f210b68316c8d1caa929db6454cc42539739c1e  tap-guide.svg
```

