# PathProbe inline tap guide

The inline tap is a **Pro** feature and is **Linux only** (including Raspberry Pi). It is not included in the Windows build. `tap status`, `tap reset`, `tap impair --status`, `tap impair --clear`, and `tap profiles list` / `show` can be run on the Free tier. `tap bridge`, `tap capture`, `tap impair` apply, and `tap profiles save` require Pro.

This guide does not use IP addresses, MAC addresses, hostnames, or personal information. Default examples use `eth1` upstream and `eth2` downstream, with `eth0` as management.

## What it does

PathProbe builds a Linux bridge named `br-tap` between two member NICs and captures the traffic that passes through. The bridge itself has **no IP address**. Frames go through transparently: Device 1 and Device 2 keep talking as if they were connected to each other.

You can:

- Create the bridge (`tap bridge`)
- Capture to a pcapng file (`tap capture --file`)
- Stream live pcapng to stdout for Wireshark (`tap capture --stdout`)
- Apply temporary impairment with netem (`tap impair`): built-in or saved profiles, `--rate`, `--dup`, `--reorder`, delay, jitter, and loss
- Auto-revert impairment with `--for`, Ctrl-C, or a crash (`tap impair --status` and `--clear`)
- Inspect the setup (`tap status`, including `--json`)
- Tear the bridge down and restore each member NIC's pre-bridge flags and NetworkManager state, including promiscuous mode (`tap reset`)

Capture uses **dumpcap** (Debian and Raspberry Pi OS package `wireshark-common`). Install it before the first capture. USB 3 adapters are recommended. USB-C NICs that only attach through USB-A converters often run at 480 Mbps; that is expected, not a PathProbe failure.

The Pi (or other Linux host) built-in NIC is **management only**. Do not add it to the bridge. PathProbe refuses the default-route interface unless you pass `--allow-default-route`.

## Connection diagram

```
Device 1  ----  USB NIC eth1  ----  Raspberry Pi                  ----  USB NIC eth2  ----  Device 2
                                    br-tap (bridge, no IP)
                                    built-in NIC eth0  ----  management network
                                    (management only, never bridged)
```

A SVG/PNG of this layout ships with this guide as `tap-guide.svg` and `tap-guide.png`.

Typical roles:

- **eth1** — USB NIC, upstream toward Device 1 (or the next switch)
- **eth2** — USB NIC, downstream toward Device 2
- **eth0** — built-in NIC, management only, not a bridge member
- **br-tap** — the capture bridge, no IP address

Replace `eth0` / `eth1` / `eth2` with the names on your machine (`ip -br link`).

## Commands

Activate a Pro license first on this computer, then:

```bash
# Create the transparent bridge (Pro, Linux).
# Defaults are eth1 upstream and eth2 downstream.
# Default-route / management NIC is refused unless you pass --allow-default-route.
sudo pathprobe tap bridge --upstream eth1 --downstream eth2 --mgmt eth0

# Inspect (Free or Pro).
pathprobe tap status
pathprobe tap status --json

# Capture to a file (Pro). Duration is a Go duration: 20s, not 20.
# PathProbe creates the file so capture still works in a 0700 directory.
sudo pathprobe tap capture --file pathprobe-tap.pcapng --duration 30s

# Optional BPF filter. Keep filters generic; do not paste real addresses.
sudo pathprobe tap capture --file pathprobe-tap.pcapng --filter 'icmp or arp' --duration 30s

# Live stream to Wireshark on the same computer (pcapng on stdout, logs on stderr).
sudo pathprobe tap capture --stdout --duration 30s 2>tap.log | wireshark -k -i -

# Live stream over SSH to Wireshark on your workstation.
# Substitute the tap host privately; do not publish its address.
# ssh to the tap host, then:  sudo pathprobe tap capture --stdout --duration 30s
# pipe that pcapng stream into:  wireshark -k -i -

# Tear down the bridge and restore member NIC flags, including promiscuous mode.
sudo pathprobe tap reset

# If the bridge is already gone, reset is a no-op and does not need root.
pathprobe tap reset
```

`--stdout` and `--file -` are the same: pcapng on stdout. Do not combine `--stdout` with a real `--file` path.

## Impairment with tap impair (Pro)

`tap impair` applies Linux netem on the existing bridge member ports (`eth1` and/or `eth2`), not on `br-tap` itself and never on the management NIC. Apply requires Pro and a bridge that is already up. `--status`, `--clear`, and `tap profiles list` / `show` are free.

Use `--for` so impairment auto-reverts when the timer expires, when you press Ctrl-C, or if the process crashes. Confirm with `tap impair --status`. `--clear` removes netem and leaves the bridge up. `tap reset` also clears netem when it tears the bridge down.

```bash
# Built-in profiles (Pro). Defaults stay eth1 upstream, eth2 downstream.
sudo pathprobe tap impair --profile lossy-wifi --for 30s
sudo pathprobe tap impair --profile satellite --for 30s
sudo pathprobe tap impair --profile congested-wan --for 30s
sudo pathprobe tap impair --profile flaky-link --for 30s

# Rate cap, duplication, and reorder (Pro). Combine with --delay / --jitter / --loss as needed.
sudo pathprobe tap impair --dir both --rate 1mbit --for 30s
sudo pathprobe tap impair --dir both --dup 5% --for 30s
sudo pathprobe tap impair --dir both --reorder 10% --for 30s

# Watch current impairment (Free or Pro).
pathprobe tap impair --status

# Remove netem and leave the bridge up (Free or Pro).
pathprobe tap impair --clear

# Built-in and saved profiles (list and show are Free; save is Pro).
pathprobe tap profiles list
pathprobe tap profiles show --name lossy-wifi
sudo pathprobe tap profiles save --name lab-lossy --delay 40ms --loss 2% --rate 20mbit
```

Built-in profiles:

- `lossy-wifi` — 40 ms delay and jitter, 2% loss, 2% reorder, 20 Mbit/s rate
- `satellite` — 300 ms delay, 50 ms jitter, 0.5% loss, 25 Mbit/s rate
- `congested-wan` — 80 ms delay, 20 ms jitter, 1% loss, 5 Mbit/s rate
- `flaky-link` — 20 ms delay, 10 ms jitter, 5% loss, 2% duplication, 2% reorder

`--dir` is `to-downstream`, `to-upstream`, or `both`. There is one netem at a time per member; a new apply replaces the previous settings until auto-revert or `--clear`.

## Optional Linux inspection

These are also manual Linux commands, useful while the bridge is up.

```bash
# Bridge membership and forwarding
ip -br link
bridge link
bridge fdb show br br-tap

# Addresses (br-tap should have none)
ip -br addr show br-tap

# A second, independent capture (does not replace pathprobe tap capture)
sudo tcpdump -n -i br-tap -c 20 'icmp or arp'

# Confirm the management NIC is still independent
ip -br addr show eth0

# Current PathProbe impairment, if any
pathprobe tap impair --status
```

## Reset and cleanup

`pathprobe tap reset` deletes `br-tap`, clears leftover netem, and restores saved pre-bridge flags and NetworkManager managed state on the member NICs (promiscuous mode, and when a snapshot exists also allmulti / noarp / multicast and up/down). `tap reset` accepts the same `--mgmt` and `--allow-default-route` flags as `tap bridge` and does not touch the management interface. If you upgraded mid-session and no snapshot is present, reset turns promiscuous mode off and leaves the NIC up.

After reset, give NetworkManager (or your DHCP client) a moment if a member NIC should have an address again. Do not add the management NIC to the bridge. Do not impair the management NIC.

## License and platforms

| Item | Rule |
| --- | --- |
| `tap bridge`, `tap capture`, `tap impair` apply, `tap profiles save` | Pro, Linux (including Raspberry Pi) |
| `tap status`, `tap reset`, `tap impair --status`, `tap impair --clear`, `tap profiles list` / `show` | Free or Pro, Linux |
| Windows | The `tap` command is not present |

Buy PathProbe Pro: https://getpathprobe.com/#pricing
