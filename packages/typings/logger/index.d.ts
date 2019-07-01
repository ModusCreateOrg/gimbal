export interface SpinniesConfig {
  color?: string;
  disableSpins?: boolean;
  failColor?: string;
  failPrefix?: string;
  spinnerColor?: string;
  succeedColor?: string;
  succeedPrefix?: string;
  spinner?: {
    frames: string[];
    interval: number;
  };
}

export interface SpinniesOptions {
  color?: string;
  failColor?: string;
  status?: 'fail' | 'non-spinnable' | 'spinning' | 'stopped' | 'succeed';
  succeedColor?: string;
  text: string;
}

export interface SpinniesFailure {
  failColor?: string;
  text: string;
}

export interface SpinniesSuccess {
  succeedColor?: string;
  text: string;
}

export type SpinniesFinish = SpinniesFailure | SpinniesSuccess;
