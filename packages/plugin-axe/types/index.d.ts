import { ImpactValue } from 'axe-core';

export type ThresholdValueString = ImpactValue | 'none';

export interface Thresholds {
  impact: number | ThresholdValueString;
  [name: string]: number | ThresholdValueString;
}

export interface Config {
  disabledRules?: string | string[];
  exclude?: string | string[];
  include?: string | string[];
  rules?: string | string[];
  showSuccesses: boolean;
  tags?: string | string[];
  thresholds: Thresholds;
}

export type ImpactMap = {
  [key in ThresholdValueString]: number;
};
