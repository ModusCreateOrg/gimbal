import { Config } from '@/typings/module/heap-snapshot';

const defaultConfig: Config = {
  threshold: {
    Documents: 5,
    Frames: 2,
    LayoutCount: 5,
    Nodes: 75,
    RecalcStyleCount: 4,
  },
};

export default defaultConfig;
