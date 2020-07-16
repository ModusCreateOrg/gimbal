import { Config } from '@/typings/config';
import { Config as v2config } from '@/typings/config/versions/2';

const handler = (config: v2config): Config => config;

export default handler;
