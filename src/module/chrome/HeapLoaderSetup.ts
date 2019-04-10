// @ts-ignore
global.HeapSnapshotModel = {};

// @ts-ignore
global.HeapSnapshotWorker = {};

// @ts-ignore
global.Common = { UIString: (x): void => x };

// @ts-ignore
global.TextUtils = { TextUtils: {} };

const runtime = { queryParam: (): boolean => false };

// @ts-ignore
global.Runtime = runtime;

// @ts-ignore
global.self = {
  Runtime: runtime,
  addEventListener: (): void => {},
};
