export interface Audit {
  disabled?: boolean;
  module: string;
  name: string;
}

export interface AuditObject {
  [name: string]: Audit;
}

export interface AuditObjectConfig {
  [name: string]: boolean | Partial<Audit>;
}

export type ConfigValue = string[] | AuditObjectConfig;

export interface Capabilities {
  browserable: boolean;
  hasLocalRoute: boolean;
}
