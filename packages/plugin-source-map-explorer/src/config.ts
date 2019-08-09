import { Meta } from '@/typings/module';

export interface BundleThreshold {
  [file: string]: string;
}

export interface BundleObject {
  disable?: boolean;
  path: string;
  thresholds: BundleThreshold;
}

export type BundleType = string | BundleObject;

export interface Config {
  bundles: BundleType[];
}

export const defaultConfig: Config = {
  bundles: ['**/*.js'],
};

export const meta: Meta = {
  maxNumRoutes: 1,
  thresholdLimit: 'upper',
  thresholdType: 'size',
};

export const type = 'source-map-explorer';
