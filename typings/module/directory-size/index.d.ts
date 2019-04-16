export interface DirectoryConfig {
  maxSize: string;
}

export interface ParsedDirectoryConfig {
  failures: DirectoryCheck[];
  successes: DirectoryCheck[];
}

export interface DirectoryCheck {
  path: string;
  size: number;
  maxSize: string;
}
