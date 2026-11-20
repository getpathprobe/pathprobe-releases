# PathProbe 1.2.0

**PathProbe is a command-line (CLI) tool with no GUI.** Use Command Prompt or PowerShell on Windows and a terminal on Linux.

## What's new

- `dhcp run` JSON and NDJSON output
- Automatic run log
- MCP server so AI agents can use PathProbe
- Scheduled profile runs with ntfy and webhook alerts (bare ntfy topics are accepted)
- NetBox and Nautobot inventory
- CLI polish

## Tiers

**Pro:** live `dhcp run --json` events; the new `--json` on `target`, `static`, `dhcp release`, `dhcp stop`, and `profile`; the MCP server; and scheduled runs with alerts.

**Free:** the nine commands that had `--json` in 1.1.3, the `dhcp run` final summary, the run log, and inventory.

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
| `pathprobe_1.2.0_amd64.deb` | Ubuntu 22.04 / 24.04, Debian 12 and newer (x64) |
| `pathprobe_1.2.0_arm64.deb` | Ubuntu / Debian and Raspberry Pi OS 64-bit (arm64) |
| `pathprobe-1.2.0-linux-amd64.tar.gz` | Other Linux distributions (x64) |
| `pathprobe-1.2.0-linux-arm64.tar.gz` | Other Linux distributions and Raspberry Pi (arm64) |
| `PathProbe-1.2.0-windows-amd64.zip` | Windows 10/11 x64 (portable; run from an Administrator terminal) |
| `SHA256SUMS` | Checksums |
| `latest.json` | In-app update notice (`{"version":"1.2.0"}`) |

Windows needs Npcap (WinPcap API-compatible Mode). The Windows build is not code-signed; SmartScreen may warn.
