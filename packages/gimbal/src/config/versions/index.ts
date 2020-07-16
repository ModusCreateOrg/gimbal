import { Config, RawConfig } from '@/typings/config';
import { Config as v1config } from '@/typings/config/versions/1';
import { Config as v2config } from '@/typings/config/versions/2';
import v1 from './1';
import v2 from './2';

const handler = (config: RawConfig): Config => {
  const version = (config as v2config).version ? parseInt((config as v2config).version as string, 10) : 1;

  switch (version) {
    case 2:
      return v2(config as v2config);
    case 1:
      return v1(config as v1config);
    default:
      throw new Error(`Version "${version}" is not a valid version!`);
  }
};

export default handler;
