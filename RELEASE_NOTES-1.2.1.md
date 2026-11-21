# PathProbe 1.2.1

**PathProbe is a command-line (CLI) tool with no GUI.** Use Command Prompt or PowerShell on Windows and a terminal on Linux.

## What's new in 1.2.1

- **Full results in the run log.** The run log now keeps MAC addresses and IP addresses by default, so you can look back and see which client got which address. License keys, tokens, passwords, and webhook or ntfy URLs and topics are still always redacted. `--no-log` (or `PATHPROBE_NO_LOG=1`) still skips the log.
- **`pathprobe log share` (Free).** Writes a scrubbed copy of the run log for a support ticket or forum post: MACs become `[redacted-mac]` and real IPs become `[redacted-ip]`, while the documentation ranges `192.0.2.0/24`, `198.51.100.0/24`, and `203.0.113.0/24` stay visible. `--hostnames` also hides DNS names, `--last N` keeps only the newest lines, and `--out FILE` writes to a file. `--log-redact` (or `PATHPROBE_LOG_REDACT=1`) scrubs addresses as the log is written.
- **Webhook URLs are no longer saved in the local run log.** A webhook URL passed to `pathprobe schedule install --webhook URL` (and other secret flag values written as `--flag VALUE`) is now redacted in the run log and in `log share` output.
- `dhcp run --help` now says to confirm you own the network or are authorized to test it.

Licensing, activation, tiers, and pricing are unchanged from 1.2.0. 1.2.0 and 1.1.3 seats stay Pro on the same computer.

## Included from 1.2.0

- `dhcp run` JSON and NDJSON output
- Automatic run log
- MCP server so AI agents can use PathProbe
- Scheduled profile runs with ntfy and webhook alerts (bare ntfy topics are accepted)
- NetBox and Nautobot inventory
- CLI polish

## Tiers

**Pro:** live `dhcp run --json` events; the new `--json` on `target`, `static`, `dhcp release`, `dhcp stop`, and `profile`; the MCP server; and scheduled runs with alerts.

**Free:** the nine commands that had `--json` in 1.1.3, the `dhcp run` final summary, the run log, `log share`, and inventory.

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
| `pathprobe_1.2.1_amd64.deb` | Ubuntu 22.04 / 24.04, Debian 12 and newer (x64) |
| `pathprobe_1.2.1_arm64.deb` | Ubuntu / Debian and Raspberry Pi OS 64-bit (arm64) |
| `pathprobe-1.2.1-linux-amd64.tar.gz` | Other Linux distributions (x64) |
| `pathprobe-1.2.1-linux-arm64.tar.gz` | Other Linux distributions and Raspberry Pi (arm64) |
| `PathProbe-1.2.1-windows-amd64.zip` | Windows 10/11 x64 (portable; run from an Administrator terminal) |
| `SHA256SUMS` | Checksums |
| `latest.json` | In-app update notice (`{"version":"1.2.1"}`) |
| `README.md`, `EXAMPLES.md`, `EXAMPLES.txt`, `DHCP-REFERENCE.md`, `RFC2131.txt`, `LICENSE` | The guide and reference docs (also inside every download) |

Windows needs Npcap (WinPcap API-compatible Mode). The Windows build is not code-signed; SmartScreen may warn.
