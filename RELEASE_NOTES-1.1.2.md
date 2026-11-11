# PathProbe 1.1.2

**PathProbe is a command-line (CLI) tool with no GUI. Use Command Prompt or PowerShell on Windows and a terminal on Linux.**

Windows first-run polish, Windows traceroute/capture fix and Buy Pro link release. No new features, no change to the free tier (5 clients) or the Pro price.

**One-time purchase. Your Pro license includes free updates for all 1.x releases. Major new versions (such as 2.0) may require a new license.** This is a note only: the license code has no version or major-version limit today, and a key bought for any 1.x release keeps working on 1.1.2 and every later 1.x release. The key does not contain or check a program version.

## Changes in 1.1.2

- **Windows installer, Npcap prompt.** When Npcap is not found the installer now asks one short question: `Npcap was not found. PathProbe needs Npcap (free) with "WinPcap API-compatible Mode" checked. Open the Npcap download page now?` Yes opens https://npcap.com/#download in your browser and the install continues; No just continues. Silent installs (`/SILENT`, `/VERYSILENT`, `/SUPPRESSMSGBOXES`) never ask and never open a browser. The long VLAN-tag advice moved out of the installer into the README (802.1Q tags on Windows).
- **Windows, clearer errors.** `dhcp run`, `scan` and `target --raw` now check for Npcap before checking for Administrator, so a non-admin user without Npcap sees how to install Npcap first. When the terminal is already elevated and Npcap is missing, the message only says Npcap is missing and where to get it; it no longer says "needs Administrator". Duplicate lines in the Npcap error were removed.
- **First-run welcome.** The one-time welcome now prints to standard output instead of standard error, so PowerShell no longer shows it as red error text. It is not printed for `--version`/`version`, `pathprobe examples`, or any command with `--json`, and those do not use up the "shown once" marker; it appears on the first real command or on `--help`. The marker file, `--quiet`, the `--i-am-authorized` note and the `pathprobe examples` pointer are unchanged.
- **Licensing.** Verified and tested that a license issued for an older version validates on 1.1.2 and later (new unit test). `pathprobe-licgen sign` and `webhook` now issue perpetual keys by default (previously 365 days); the store webhook was already perpetual.
- **DHCP reference.** The packages now include `DHCP-REFERENCE.md` (`DHCP-REFERENCE.txt` on Windows), a short plain-language overview of DISCOVER/OFFER/REQUEST/ACK, lease renewal (T1/T2), RELEASE/DECLINE/NAK and how `dhcp run` maps to them, plus the unmodified IETF text `RFC2131.txt` (https://www.rfc-editor.org/rfc/rfc2131). They are installed to `/usr/share/doc/pathprobe/` (.deb) and the program folder (Windows, with a Start menu shortcut); nothing in the program itself changed for this.
- **License agreement.** The EULA now states: A Pro license is a one-time purchase that includes free updates for all 1.x releases. Major new versions (such as 2.0) may require a new license.
- **Windows traceroute and captures.** `traceroute` lists every hop again (IPv4 probes use the Windows ICMP helper, like tracert; before, every hop printed `*`). `--capture` with `internet`, `whoami` and `traceroute` now records the packets instead of writing an empty file.
- **Buy Pro link.** The link now opens the Paddle checkout: `https://getpathprobe.com/#pricing` (the Buy Pro button there opens Paddle). It replaces the old Lemon Squeezy store link (https://pathprobe.lemonsqueezy.com), which is no longer used, in `pathprobe license status`, both upgrade prompts (asking for more than 5 clients, and QinQ), `pathprobe examples`, the README files and the snap description. `PATHPROBE_BUY_URL` still overrides it.
- **Docs.** The README now says Pro is sold through Paddle (Buy Pro at https://getpathprobe.com/#pricing) instead of "coming soon", and the long-form guide was corrected to the 5-client free tier and the Paddle link.
- **Version.** 1.1.2 in the binary, installer, packages, docs and Makefile/snap. Free tier is still 5 DHCP clients.

Test hook (documented for support): setting `PATHPROBE_NPCAP_ROOT` to a folder that has no `System32\Npcap\wpcap.dll` makes PathProbe behave as if Npcap were not installed. The installer accepts `/SIMULATENPCAPMISSING` for the same purpose.

## Downloads

| File | For |
| --- | --- |
| `pathprobe_1.1.2_amd64.deb`, `pathprobe_1.1.2_arm64.deb` | Ubuntu 22.04 / 24.04, Debian 12 and newer |
| `pathprobe-1.1.2-linux-amd64.tar.gz`, `pathprobe-1.1.2-linux-arm64.tar.gz` | Other Linux distributions |
| `PathProbe-Setup-1.1.2.exe` | Windows 10/11 x64 installer |
| `PathProbe-1.1.2-windows-amd64.zip` | Windows 10/11 x64 portable |
| `SHA256SUMS` | Checksums for all of the above |

Verify with `sha256sum -c --ignore-missing SHA256SUMS` (Linux; SHA256SUMS also lists the docs inside the packages) or `Get-FileHash` (Windows).

## Known limits

- The Windows installer and `pathprobe.exe` are **not code-signed**; SmartScreen will show an "unknown publisher" warning. Choose More info, then Run anyway.
- **Npcap** must be installed separately on Windows (it cannot be bundled).
- The linux/arm64 build was tested under CPU emulation only.
- The license agreement text has not been reviewed by a lawyer.

Full 1.1.1 notes are in CHANGELOG.md.
