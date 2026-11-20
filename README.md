# PathProbe — release downloads

PathProbe is a **command-line network test tool**. It has **no graphical interface**; every feature runs from a terminal (Linux shell or an Administrator Command Prompt / PowerShell on Windows).

This repository contains **release binaries and documentation only**. Source code is not published here.

Website: https://getpathprobe.com · Support: service@getpathprobe.com

## Download

Get the latest version from the [Releases page](https://github.com/getpathprobe/pathprobe-releases/releases/latest).

| Platform | File |
|---|---|
| Debian/Ubuntu x86_64 | `pathprobe_1.1.3_amd64.deb` |
| Linux x86_64 (generic) | `pathprobe-1.1.3-linux-amd64.tar.gz` |
| Windows 10/11 x64 portable | `PathProbe-1.1.3-windows-amd64.zip` |

## Install

**Debian / Ubuntu**
```sh
sudo apt install ./pathprobe_1.1.3_amd64.deb
pathprobe --help
```

**Other Linux**
```sh
tar xzf pathprobe-1.1.3-linux-amd64.tar.gz
sudo install pathprobe-1.1.3-linux-amd64/pathprobe /usr/local/bin/
pathprobe --help
```
Raw-socket features need root, or `sudo setcap cap_net_raw,cap_net_admin+ep $(command -v pathprobe)`.

**Windows**
Unzip `PathProbe-1.1.3-windows-amd64.zip`. Then open an **Administrator** Command Prompt and run `pathprobe --help`.
DHCP simulation, scan and capture require [Npcap](https://npcap.com/#download) installed in "WinPcap API-compatible Mode" (not bundled). The installer and binaries are not code-signed yet, so SmartScreen may warn.

## Verify checksums
```sh
sha256sum -c SHA256SUMS --ignore-missing
```
Windows PowerShell: `Get-FileHash .\PathProbe-1.1.3-windows-amd64.zip -Algorithm SHA256` and compare with `SHA256SUMS`.

## Free vs Pro
- **Free ($0):** all core commands (DHCP, interfaces, env, scan, link, internet, whoami, traceroute, static addressing, and target); DHCP simulation up to 5 clients; none or a single 802.1Q tag; packet capture (pcapng); core RFC/IEEE standards checks; JSON on interfaces, env, link, internet, whoami, traceroute, scan, dhcp status, and license status; examples command.
- **Pro ($9.99 one-time):** everything in Free, plus up to 1,000 DHCP clients, QinQ (stacked VLAN tags), saved profiles with export, and extra standards checks. One license = one computer, non-transferable (one-time online activation: `pathprobe license activate --key PP1....`).
- **Coming in 1.2 (Pro):** JSON on dhcp run, target, static, dhcp release/stop, and profiles; automatic run log; MCP server (use PathProbe from an AI agent); scheduled profile runs with webhook alerts.
- **Coming in 1.2 (Free and Pro):** tab completion and typo suggestions, copy a run as a command, and clearer error messages.

Buy Pro at https://getpathprobe.com/#pricing (Paddle checkout).

## Documentation
`README` and `EXAMPLES` are included in each download and installed with the packages.

## Responsible use
Only use PathProbe on networks you own or are authorized to test.

## License
Proprietary; see [LICENSE](LICENSE). © 2026 PathProbe.
