# PathProbe 1.1.1

**PathProbe is a command-line (CLI) tool with no GUI. Use Command Prompt or PowerShell on Windows and a terminal on Linux.**

**Draft. Not published.** First release with Pro license keys, Linux packages for Ubuntu, Debian and other distributions, and a Windows installer.

## Changes in 1.1.1

- **Environment detection (Linux).** New `pathprobe env` (alias `doctor`) reports whether the computer is a virtual machine and which network manager (NetworkManager, systemd-networkd, none) is in use, in text and `--json`. `interfaces` prints the same on stderr and adds an `environment` object to `--json`. On Windows `env` reports that detection is Linux-only.
- **Warnings.** `dhcp run` warns when `--duration` is shorter than `count x 4 s + 10 s`. `interfaces`, `dhcp run`, `scan` and `env` warn when an interface has a 10.0.2.x address (VirtualBox NAT or QEMU user-mode), since results then describe the virtual NAT network and not your real LAN. Warnings never change the exit code.
- **DHCP.** Free tier allows 5 clients. `dhcp run` reports `N of M clients bound` and exits 1 when `--duration` ends before all clients bind (Ctrl-C still exits 0). Default start spacing is min(0.5 s, 10 s / count).
- **Fixes.** `license clear` accepts its flags. `scan --cidr` stays inside the given subnet and skips IPv6 discovery. `static clear` also removes the default route it added. `--capture` no longer swallows a following command word (use `--capture=FILE`), and captures include outgoing frames and flush on exit. `profile list --help` (and `--help` on every subcommand) prints help and exits 0 on the Free tier.

## Downloads

| File | For |
| --- | --- |
| `pathprobe_1.1.1_amd64.deb`, `pathprobe_1.1.1_arm64.deb` | Ubuntu 22.04 / 24.04, Debian 12 and newer |
| `pathprobe-1.1.1-linux-amd64.tar.gz`, `pathprobe-1.1.1-linux-arm64.tar.gz` | Fedora, Rocky/Alma 9, Arch, openSUSE Leap/Tumbleweed, Alpine and other systemd or non-systemd Linux |
| `PathProbe-Setup-1.1.1.exe` | Windows 10/11 x64 installer |
| `PathProbe-1.1.1-windows-amd64.zip` | Windows 10/11 x64 portable |
| `SHA256SUMS` | Checksums for all of the above |

Verify with `sha256sum -c SHA256SUMS` (Linux) or `Get-FileHash` (Windows).

## What is new

- **Pro license keys.** Free and Pro tiers. Pro is $9.99. Keys are signed offline (Ed25519) and activate without an internet connection: `pathprobe license activate --key <key>`.
- **Linux packages.** The .deb installs `/usr/bin/pathprobe`, a systemd unit for `--persist`, a man page and the license, and grants `cap_net_raw,cap_net_admin` so the tool works without root. The package depends only on `libcap2-bin`; `iproute2` is no longer required.
- **Linux tar.gz.** A static binary, the systemd unit, the license and a README with setcap instructions per distribution. Nothing else needs installing.
- **Windows installer and zip.** Installs `pathprobe.exe`, adds it to PATH and ships the license. Packet tests need Npcap (separate download, not bundled).
- **License agreement.** PathProbe is proprietary software under an end user license agreement (`LICENSE`, included in every package). It permits use only on networks you own or are authorized to test.
- **Build and module.** The Go module path is now the neutral `pathprobe`, so release binaries carry no personal or account names. Builds are reproducible (`scripts/release.sh`).
- **Command-line wording.** `dhcp run` now says plainly what it needs: `This command needs --i-am-authorized (or --authorized) to confirm you are allowed to test this network.`, with an example. `--help`, the README and a new Quick start section describe the flag. Nothing in the CLI asks you to click.
- **Interface names.** `--iface` accepts the adapter name in any letter case, or its MAC address. A name that does not match prints the available interfaces. An unquoted name with spaces now stops with `unexpected argument ... (quote interface names containing spaces)` instead of a confusing client-count error.
- **Usage guide.** `EXAMPLES.md` (and `EXAMPLES.txt` for Windows) shows a runnable example for every command, with Windows and Linux variants. It is installed with the `.deb` (`/usr/share/doc/pathprobe`), the tarball, the Windows zip and the installer, and attached to the release as a standalone file.
- **First-run welcome and `pathprobe examples`.** The first time PathProbe runs it prints a short note on stderr (it is a command-line tool; `dhcp run` needs `--i-am-authorized` or `--authorized`; where the examples guide is installed). It is shown once (marker file `firstrun` in the user config folder) and `--quiet` or `PATHPROBE_QUIET=1` hides it. `pathprobe examples` prints the guide built into the program.
- **Windows profiles.** `profile show`, `export` and `import` now work on Windows too; they were listed in the help but not implemented in the Windows build.
- **Buy link.** The Pro link defaults to https://pathprobe.lemonsqueezy.com everywhere (command line and docs), with no placeholder text.
- **Docs.** README has install sections for Ubuntu/Debian, other Linux distributions and Windows (SmartScreen and Npcap notes).

## Fixes

- Removed the unreleased hidden `pathprobe gui` local web page and its code. PathProbe is CLI only; `pathprobe gui` now reports `unknown command "gui"` (exit code 2).
- `go vet` copied-lock warning in the trace option code (`internal/app/traceopt.go`).
- Data race in the `pkg/target` stats test (test-only; no runtime change). CI now runs `go vet` and `go test -race`.
- Packaging: setcap path in the .deb postinst, md5sums, man page, changelog and copyright files.

## Tested on

Static linux/amd64 binary, functional run on each: version, help, license status, interfaces, link, static IP apply (netlink), network scan, DHCP client simulation (3 clients against a local test server, all bound and released), internet check, target listener.

| Distribution | Result |
| --- | --- |
| Ubuntu 22.04, Ubuntu 24.04 | pass |
| Debian 12 | pass |
| Fedora, Rocky Linux 9.3, AlmaLinux 9.8 | pass |
| Arch Linux, openSUSE Leap 16, openSUSE Tumbleweed | pass |
| Alpine 3.24 | pass |

Also: .deb passes lintian apart from two accepted notes (statically linked Go binary; `systemctl` call in prerm), installs, sets capabilities, verifies with `dpkg -V`, removes and purges cleanly. Windows installer built with Inno Setup, silently installed and uninstalled under Wine; `pathprobe.exe` runs and reports the Free tier. A license signed with the release key activates Pro; one signed with any other key is rejected.

## Known limits

- The Windows installer and `pathprobe.exe` are **not code-signed**; SmartScreen will show an "unknown publisher" warning. Choose More info, then Run anyway.
- **Npcap** must be installed separately on Windows.
- The linux/arm64 build was tested under CPU emulation only. Raw-socket features (scan, DHCP) could not be exercised there and need real hardware.
- The Windows build has not yet been run on a physical Windows 10/11 PC with Npcap; the DHCP double-Discover fix in the Windows path is unverified on real hardware.
- The Ubuntu .deb has been installed in a Debian 13 sandbox, not yet on a stock Ubuntu VM.
- Distribution coverage means "the static binary ran correctly"; systemd `--persist` was not exercised inside the containers.
- The license agreement text has not been reviewed by a lawyer.
