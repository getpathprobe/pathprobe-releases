# PathProbe — release downloads

PathProbe is a **command-line network test tool**. It has **no graphical interface**; every feature runs from a terminal (Linux shell or an Administrator Command Prompt / PowerShell on Windows).

This repository contains **release binaries and documentation only**. Source code is not published here.

Website: https://getpathprobe.com · Support: service@getpathprobe.com

## Download

Get the latest version from the [Releases page](https://github.com/getpathprobe/pathprobe-releases/releases/latest).

| Platform | File |
|---|---|
| Debian/Ubuntu x86_64 | `pathprobe_1.1.2_amd64.deb` |
| Debian/Ubuntu ARM64 | `pathprobe_1.1.2_arm64.deb` |
| Linux x86_64 (generic) | `pathprobe-1.1.2-linux-amd64.tar.gz` |
| Linux ARM64 (generic) | `pathprobe-1.1.2-linux-arm64.tar.gz` |
| Windows 10/11 x64 installer | `PathProbe-Setup-1.1.2.exe` |
| Windows 10/11 x64 portable | `PathProbe-1.1.2-windows-amd64.zip` |

## Install

**Debian / Ubuntu**
```sh
sudo apt install ./pathprobe_1.1.2_amd64.deb
pathprobe --help
```

**Other Linux**
```sh
tar xzf pathprobe-1.1.2-linux-amd64.tar.gz
sudo install pathprobe-1.1.2-linux-amd64/pathprobe /usr/local/bin/
pathprobe --help
```
Raw-socket features need root, or `sudo setcap cap_net_raw,cap_net_admin+ep $(command -v pathprobe)`.

**Windows**
Run `PathProbe-Setup-1.1.2.exe` as Administrator (adds PathProbe to the system PATH), or unzip the portable build. Then open an **Administrator** Command Prompt and run `pathprobe --help`.
DHCP simulation, scan and capture require [Npcap](https://npcap.com/#download) installed in "WinPcap API-compatible Mode" (not bundled). The installer and binaries are not code-signed yet, so SmartScreen may warn.

## Verify checksums
```sh
sha256sum -c SHA256SUMS --ignore-missing
```
Windows PowerShell: `Get-FileHash .\PathProbe-Setup-1.1.2.exe -Algorithm SHA256` and compare with `SHA256SUMS`.

## Free vs Pro
- **Free:** all core commands; DHCP simulation limited to 5 clients / IPs.
- **Pro ($9.99):** up to 1000 DHCP clients, QinQ, and saved profiles with export. Buy Pro at https://getpathprobe.com/#pricing (Paddle checkout).

## Documentation
`README.md` and `EXAMPLES.md` are attached to each release and installed with the packages.

## Responsible use
Only use PathProbe on networks you own or are authorized to test.

## License
Proprietary; see [LICENSE](LICENSE). © 2026 PathProbe.
