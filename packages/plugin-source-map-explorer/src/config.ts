import { Meta } from '@/typings/module';

export interface BundleThreshold {
  [file: string]: string;
}

export interface BundleObject {
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
  thresholdLimit: 'upper',
  thresholdType: 'size',
};

export const type = 'source-map-explorer';
