# PathProbe 1.2.3

**PathProbe is a command-line (CLI) tool with no GUI.** Use Command Prompt or PowerShell on Windows and a terminal on Linux.

## What's new in 1.2.3

- **72-hour free Pro trial.** A computer with no license gets 72 hours of full Pro, including the inline tap and live `dhcp run --json`. No email and no card. `license status` shows the time left. After 72 hours the tier is Free and says `Trial ended, buy Pro $9.99` with https://getpathprobe.com/.
- **The trial start is stored on the computer** so deleting the user folder does not restart the clock. Linux packages create `/var/lib/pathprobe/trial.json` (mode 0644). Windows uses `C:\ProgramData\PathProbe`. A tarball creates the same Linux file on the first sudo run. An activated Pro key is never changed by the trial, so a 1.2.2 Pro upgrade stays Pro. A 1.2.2 Free install gets the 72 hours once.
- **TrialSync.** These builds can reconcile the local start with the PathProbe license service so the same computer keeps one start time.

The inline tap from 1.2.2 is unchanged and is included in this Pro trial.

This public release also includes the 1.2.0 feature set and the 1.2.1 run-log fixes.

**One purchase, one license, one computer, non-transferable.** Activate with `pathprobe license activate --key PP1....` while online. Activating again on that same computer is allowed. A second computer is refused. There is no deactivate or transfer command.

**One-time purchase. Your Pro license includes free updates for all 1.x releases. Major new versions (such as 2.0) may require a new license.** A key bought for any 1.x release still activates on 1.2.3.

Buy Pro: https://getpathprobe.com/#pricing

## Included from 1.2.2

- **Inline tap (Pro, Linux and Raspberry Pi only).** `pathprobe tap` builds a transparent Linux bridge (`br-tap`, no IP address) between two USB NICs, captures to a pcapng file or streams live pcapng to stdout for Wireshark, and tears the bridge down with `tap reset`. The built-in NIC stays on management and is never bridged. Capture uses dumpcap (Debian / Raspberry Pi OS package `wireshark-common`). This command is not in the Windows build. `tap status` and `tap reset` can be run on the Free tier. Guide: https://getpathprobe.com/tap-guide.html

## Downloads

| File | For |
| --- | --- |
| `pathprobe_1.2.3_amd64.deb`, `pathprobe_1.2.3_arm64.deb` | Ubuntu 22.04 / 24.04, Debian 12 and newer |
| `pathprobe-1.2.3-linux-amd64.tar.gz`, `pathprobe-1.2.3-linux-arm64.tar.gz` | Other Linux distributions |
| `PathProbe-1.2.3-windows-amd64.zip` | Windows 10/11 x64 portable (Npcap required) |
| `SHA256SUMS` | Checksums for the files in this release |
| `TAP-GUIDE.md`, `tap-guide.svg`, `tap-guide.png` | Inline tap guide (same as 1.2.2) |

Verify with `sha256sum -c SHA256SUMS` (Linux) or `Get-FileHash` (Windows).

## Known limits

- The Windows program is **not code-signed**; SmartScreen may show an "unknown publisher" warning. Choose More info, then Run anyway.
- **Npcap** must be installed separately on Windows (it cannot be bundled).
- The linux/arm64 build is the same source as amd64.
- Inline tap is Linux and Raspberry Pi only (not Windows).
