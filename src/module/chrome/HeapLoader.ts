// we need to setup the global namespaces first
// chrome-devtools-frontend will apply onto these namespaces
import './HeapLoaderSetup';
import 'chrome-devtools-frontend/front_end/heap_snapshot_model/HeapSnapshotModel';
import 'chrome-devtools-frontend/front_end/text_utils/TextUtils';
import 'chrome-devtools-frontend/front_end/heap_snapshot_worker/AllocationProfile';
import 'chrome-devtools-frontend/front_end/heap_snapshot_worker/HeapSnapshot';
import 'chrome-devtools-frontend/front_end/heap_snapshot_worker/HeapSnapshotLoader';
import 'chrome-devtools-frontend/front_end/heap_snapshot_worker/HeapSnapshotWorkerDispatcher';
import 'chrome-devtools-frontend/front_end/heap_snapshot_worker/HeapSnapshotWorker';

// @ts-ignore
const { HeapSnapshotWorkerDispatcher, HeapSnapshotLoader } = global.HeapSnapshotWorker;

const dispatcher = new HeapSnapshotWorkerDispatcher({}, (): void => {});

const loader = new HeapSnapshotLoader(dispatcher);

export default loader;
