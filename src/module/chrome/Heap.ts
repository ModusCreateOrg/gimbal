import { Page } from 'puppeteer';
import HeapLoader from './HeapLoader';
import { Snapshot, SnapshotStatistics } from '@/typings/module/chrome/Heap';

class Heap {
  private snapshots: Snapshot[] = [];

  public async capture(page: Page, url?: string): Promise<Snapshot> {
    const client = await page.target().createCDPSession();

    await client.send('Page.enable');
    await client.send('HeapProfiler.enable');

    if (url) {
      await page.goto(url);
    }

    client.on(
      'HeapProfiler.addHeapSnapshotChunk',
      ({ chunk }: { chunk: string }): void => {
        HeapLoader.write(chunk);
      },
    );

    await client.send('HeapProfiler.takeHeapSnapshot', { reportProgress: false });

    HeapLoader.close();

    const {
      _statistics: statistics,
      nodeCount,
      totalSize,
    }: { _statistics: SnapshotStatistics; nodeCount: number; totalSize: number } = HeapLoader.buildSnapshot();

    const snapshot: Snapshot = {
      statistics,
      nodeCount,
      totalSize,
    };

    this.snapshots.push(snapshot);

    return snapshot;
  }

  public serialize(): Snapshot[] {
    return this.snapshots;
  }
}

export default Heap;
