import { Meta } from '@/typings/module';

const meta: Meta = {
  thresholdLimit: 'upper',
  thresholdTypes: {
    Documents: 'number',
    Frames: 'number',
    JSHeapTotalSize: 'size',
    JSHeapUsedSize: 'size',
    LayoutCount: 'number',
    Nodes: 'number',
    RecalcStyleCount: 'number',
  },
};

export default meta;
