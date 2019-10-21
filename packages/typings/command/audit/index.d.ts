export interface Audit {
  disabled?: boolean;
  name: string;
}

export interface AuditObject {
  [name: string]: Audit;
}

export interface AuditObjectConfig {
  [name: string]: boolean | Audit;
}

export type ConfigValue = string[] | AuditObjectConfig;

export interface Capabilities {
  browserable: boolean;
  hasLocalRoute: boolean;
}
