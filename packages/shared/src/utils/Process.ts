import pidusage from 'pidusage';

interface ProcessConfig {
  autoStart?: boolean;
}

interface Stat {
  cpu: number; // percentage (from 0 to 100*vcore)
  memory: number; // bytes
  ppid: number; // PPID
  pid: number; // PID
  ctime: number; // ms user + system time
  elapsed: number; // ms since the start of the process
  timestamp: number; // ms since epoch
}

interface Serialized {
  stats: Stat[];
}

export default class Process {
  private interval?: NodeJS.Timeout;

  private pid: number;

  private stats: Stat[] = [];

  public constructor(pid?: number, config: ProcessConfig = { autoStart: true }) {
    this.pid = pid || process.pid;

    if (config.autoStart) {
      this.start();
    }
  }

  public async capture(): Promise<void> {
    const stats = await pidusage(this.pid);

    this.stats.push(stats);
  }

  public end(): void {
    if (this.interval) {
      clearInterval(this.interval);

      this.interval = undefined;
    }

    pidusage.clear();
  }

  public serialize(): Serialized {
    return { stats: this.stats };
  }

  public start(): void {
    const interval = setInterval((): Promise<void> => this.capture(), 500) as NodeJS.Timeout;

    this.interval = interval;

    this.capture();
  }
}
