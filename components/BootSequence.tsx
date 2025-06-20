import React, { useState, useEffect, useRef } from 'react';

interface BootSequenceProps {
  onBootComplete: () => void;
}

const bootMessages = [
  "[ 0.000000] Linux version 6.6.87-aizu-rehack (andy@aizu-rehack) (gcc 13.2.0) #1 SMP PREEMPT_DYNAMIC",
  "[ 0.000000] Command line: BOOT_IMAGE=/boot/vmlinuz root=UUID=12345678-1234-5678-9012-123456789012 ro quiet splash",
  "[ 0.000000] DMI: Aizu Rehack Virtual Machine, BIOS V1.0 01/01/2024",
  "[ 0.000000] Memory: 4194304K/4194304K available",
  "[ 0.000000] rcu: Hierarchical RCU implementation.",
  "[ 0.000000] Kernel randomization disabled.",
  "[ 0.012000] PID hash table entries: 4096 (order: 3, 32768 bytes)",
  "[ 0.025000] Mount-cache hash table entries: 1024 (order: 1, 8192 bytes)",
  "[ 0.040000] CPU: Testing write buffer coherency: ok",
  "[ 0.055000] Setting up static identity map for 0x40008240 - 0x40008298",
  "[ 0.070000] rcu: Hierarchical SRCU implementation.",
  "[ 0.085000] smp: Bringing up secondary CPUs ...",
  "[ 0.100000] CPU1: Booted secondary processor",
  "[ 0.115000] CPU2: Booted secondary processor",
  "[ 0.130000] CPU3: Booted secondary processor",
  "[ 0.145000] smp: Brought up 1 node, 4 CPUs",
  "[ 0.160000] devtmpfs: initialized",
  "[ 0.175000] clocksource: jiffies: mask: 0xffffffff max_cycles: 0xffffffff",
  "[ 0.190000] NET: Registered protocol family 16",
  "[ 0.205000] PCI: CLS 0 bytes, default 64",
  "[ 0.220000] hw-breakpoint: found 5 (+1 reserved) breakpoint registers.",
  "[ 0.235000] Serial: AMBA PL011 UART driver",
  "[ 0.250000] HugeTLB registered 1.00 GiB page size, pre-allocated 0 pages",
  "[ 0.265000] HugeTLB registered 32.0 MiB page size, pre-allocated 0 pages",
  "[ 0.280000] HugeTLB registered 2.00 MiB page size, pre-allocated 0 pages",
  "[ 0.295000] HugeTLB registered 64.0 KiB page size, pre-allocated 0 pages",
  "[ 0.310000] iommu: Default domain type: Translated",
  "[ 0.325000] SCSI subsystem initialized",
  "[ 0.340000] usbcore: registered new interface driver usbfs",
  "[ 0.355000] NetLabel: Initializing",
  "[ 0.370000] NetLabel: domain hash size = 128",
  "[ 0.385000] NetLabel: protocols = UNLABELED CIPSOv4 CALIPSO",
  "[ 0.400000] clocksource: Switched to clocksource arch_sys_counter",
  "[ 0.415000] NET: Registered protocol family 2",
  "[ 0.430000] tcp_listen_portaddr_hash hash table entries: 512",
  "[ 0.445000] TCP established hash table entries: 8192",
  "[ 0.460000] TCP bind hash table entries: 8192",
  "[ 0.475000] TCP: Hash tables configured (established 8192 bind 8192)",
  "[ 0.490000] UDP hash table entries: 512 (order: 2, 16384 bytes)",
  "[ 0.505000] NET: Registered protocol family 1",
  "[ 0.520000] RPC: Registered named UNIX socket transport module.",
  "[ 0.535000] hw perfevents: enabled with armv8_pmuv3 PMU driver",
  "[ 0.550000] Initialising system without atomic LDXR/STXR support",
  "[ 0.565000] workingset: timestamp_bits=46 max_order=20 bucket_order=0",
  "[ 0.580000] squashfs: version 4.0 (2009/01/31) Phillip Lougher",
  "[ 0.595000] NFS: Registering the id_resolver key type",
  "[ 0.610000] Key type id_resolver registered",
  "[ 0.625000] nfs4filelayout_init: NFSv4 File Layout Driver Registering...",
  "[ 0.640000] 9p: Installing v9fs 9p2000 file system support",
  "[ 0.655000] Block layer SCSI generic (bsg) driver version 0.4",
  "[ 0.670000] pl061_gpio ARMH0061:00: PL061 GPIO chip @0x09030000 registered",
  "[ 0.685000] Serial: 8250/16550 driver, 4 ports, IRQ sharing enabled",
  "[ 0.700000] SuperH (H)SCI(F) driver initialized",
  "[ 0.715000] loop: module loaded",
  "[ 0.730000] libphy: Fixed MDIO Bus: probed",
  "[ 0.745000] mousedev: PS/2 mouse device common for all mice",
  "[ 0.760000] rtc-pl031 9010000.pl031: registered as rtc0",
  "[ 0.775000] i2c /dev entries driver",
  "[ 0.790000] sdhci: Secure Digital Host Controller Interface driver",
  "[ 0.805000] ledtrig-cpu: registered to indicate activity on CPUs",
  "[ 0.820000] usbcore: registered new interface driver usbhid",
  "[ 0.835000] usbhid: USB HID core driver",
  "[ 0.850000] NET: Registered protocol family 17",
  "[ 0.865000] 9pnet: Installing 9P2000 support",
  "[ 0.880000] Key type dns_resolver registered",
  "[ 0.895000] registered taskstats version 1",
  "[ 0.910000] Loading compiled-in X.509 certificates",
  "[ 0.925000] input: gpio-keys as /devices/platform/gpio-keys/input/input0",
  "[ 0.940000] ALSA device list:",
  "[ 0.955000] No soundcards found.",
  "[ 0.970000] uart-pl011 9000000.pl011: ttyAMA0 at MMIO 0x9000000 (irq = 33, base_baud = 0)",
  "[ 0.985000] printk: console [ttyAMA0] enabled",
  "[ 1.000000] Freeing unused kernel memory: 2048K",
  "[ 1.015000] Run /sbin/init as init process",
  "[ 1.030000] systemd[1]: systemd 245.4-4ubuntu3.22 running in system mode.",
  "[ 1.045000] systemd[1]: Detected architecture arm64.",
  "[ 1.060000] systemd[1]: Set hostname to <aizu-rehack>.",
  "[ 1.075000] systemd[1]: Reached target Swap.",
  "[ 1.090000] systemd[1]: Reached target Local File Systems.",
  "[ 1.105000] systemd[1]: Starting Load Kernel Modules...",
  "[ 1.120000] systemd[1]: Starting Create Static Device Nodes in /dev...",
  "[ 1.135000] systemd[1]: Finished Create Static Device Nodes in /dev.",
  "[ 1.150000] systemd[1]: Starting udev Kernel Manager...",
  "[ 1.165000] systemd[1]: Finished Load Kernel Modules.",
  "[ 1.180000] systemd[1]: Starting Apply Kernel Variables...",
  "[ 1.195000] systemd[1]: Finished Apply Kernel Variables.",
  "[ 1.210000] systemd[1]: Started udev Kernel Manager.",
  "[ 1.225000] systemd[1]: Starting Network Service...",
  "[ 1.240000] systemd[1]: Reached target Network.",
  "[ 1.255000] systemd[1]: Starting OpenSSH server...",
  "[ 1.270000] systemd[1]: Starting Permit User Sessions...",
  "[ 1.285000] systemd[1]: Finished Permit User Sessions.",
  "[ 1.300000] systemd[1]: Starting GNOME Display Manager...",
  "[ 1.315000] systemd[1]: Started OpenSSH server.",
  "[ 1.330000] systemd[1]: Started GNOME Display Manager.",
  "[ 1.345000] systemd[1]: Reached target Multi-User System.",
  "[ 1.360000] systemd[1]: Reached target Graphical Interface.",
  "[ 1.375000] systemd[1]: Startup finished in 1.375s (kernel) + 0.000s (userspace) = 1.375s.",
  "",
  "Aizu Rehack OS v1.0",
  "Built on Linux 6.6.87-aizu-rehack",
  "",
  "🚀 Welcome to Aizu Rehack Terminal Environment",
  "🎮 Type 'gamestart' to begin your adventure",
  "",
  "Loading terminal interface...",
];

export default function BootSequence({ onBootComplete }: BootSequenceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedMessages, setDisplayedMessages] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentIndex >= bootMessages.length) {
      // Boot完了後、少し待ってからターミナルに移行
      const timer = setTimeout(() => {
        onBootComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }

    // メッセージを順次表示
    const timer = setTimeout(() => {
      setDisplayedMessages(prev => [...prev, bootMessages[currentIndex]]);
      setCurrentIndex(prev => prev + 1);
    }, 25 + Math.random() * 50); // ランダムな間隔でリアルさを演出

    return () => clearTimeout(timer);
  }, [currentIndex, onBootComplete]);

  // 新しいメッセージが追加されるたびに自動スクロール
  useEffect(() => {
    if (containerRef.current) {
      // スクロールを最下部に移動
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayedMessages]);

  return (
    <div className="h-screen w-screen bg-black text-green-400 font-mono text-sm overflow-hidden">
      <div ref={containerRef} className="p-4 h-full overflow-y-auto">
        {displayedMessages.map((message, index) => (
          <div key={index} className="whitespace-pre-wrap leading-tight">
            {message}
          </div>
        ))}
        {currentIndex < bootMessages.length && (
          <div className="inline-block w-2 h-4 bg-green-400 animate-pulse ml-1"></div>
        )}
      </div>
    </div>
  );
} 