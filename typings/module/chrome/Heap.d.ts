export interface SnapshotStatistics {
  code: number;
  jsArrays: number;
  native: number;
  strings: number;
  system: number;
  total: number;
  v8heap: number;
}

export interface Snapshot {
  nodeCount: number;
  statistics: SnapshotStatistics;
  totalSize: number;
}
