import { URL } from 'url';
import GitHub from '@/vcs/GitHub';

export interface Cls {
  is: (url: URL) => boolean;
  name: string;
}

export type VCS = GitHub;
