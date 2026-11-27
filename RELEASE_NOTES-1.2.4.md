# PathProbe 1.2.4

**PathProbe is a command-line (CLI) tool with no GUI.** Use Command Prompt or PowerShell on Windows and a terminal on Linux.

## What's new in 1.2.4

- **Inline tap impairment (Pro, Linux and Raspberry Pi only).** `pathprobe tap impair` applies named profiles (`lossy-wifi`, `satellite`, `congested-wan`, `flaky-link`) or `--rate`, `--dup`, and `--reorder` (with delay, jitter, and loss) on the existing bridge member ports. `--for` auto-reverts when the timer ends, when you press Ctrl-C, or if the process exits. `tap impair --status` and `tap impair --clear` are free. Defaults stay `eth1` upstream and `eth2` downstream. Guide: https://getpathprobe.com/tap-guide.html
- **Safer bridge reset.** `tap bridge` marks both member NICs unmanaged in NetworkManager for the life of the bridge and restores each NIC's prior managed state on `tap reset`. `tap reset` accepts the same `--mgmt` and `--allow-default-route` flags as `tap bridge` and does not fail when a previously disconnected NIC has no DHCP.
- **Integrity on every command.** Every command, including `version`, help, and free tap status commands, checks the signed `pathprobe.integrity` manifest at startup. A damaged or modified copy is refused with "This copy is damaged or has been modified; re-download from getpathprobe.com." Intact Free commands stay free.

The **72-hour free Pro trial** from 1.2.3 is unchanged: a computer with no license gets 72 hours of full Pro, including the inline tap and impairment. No email and no card. After 72 hours the tier is Free. The trial start is stored on the computer, so deleting the user folder does not restart the clock. An activated Pro key is unchanged.

**One purchase, one license, one computer, non-transferable.** Activate with `pathprobe license activate --key PP1....` while online. Activating again on that same computer is allowed. A second computer is refused. There is no deactivate or transfer command.

**One-time purchase. Your Pro license includes free updates for all 1.x releases. Major new versions (such as 2.0) may require a new license.** A key bought for any 1.x release still activates on 1.2.4.

Buy Pro: https://getpathprobe.com/#pricing

## Downloads

| File | For |
| --- | --- |
| `pathprobe_1.2.4_amd64.deb`, `pathprobe_1.2.4_arm64.deb` | Ubuntu 22.04 / 24.04, Debian 12 and newer |
| `pathprobe-1.2.4-linux-amd64.tar.gz`, `pathprobe-1.2.4-linux-arm64.tar.gz` | Other Linux distributions |
| `PathProbe-1.2.4-windows-amd64.zip` | Windows 10/11 x64 portable (Npcap required) |
| `SHA256SUMS` | Checksums for the files in this release |
| `TAP-GUIDE.md`, `tap-guide.svg`, `tap-guide.png` | Inline tap guide (updated for impairment profiles) |

Verify with `sha256sum -c SHA256SUMS` (Linux) or `Get-FileHash` (Windows).

## Known limits

- The Windows program is **not code-signed**; SmartScreen may show an "unknown publisher" warning. Choose More info, then Run anyway.
- **Npcap** must be installed separately on Windows (it cannot be bundled).
