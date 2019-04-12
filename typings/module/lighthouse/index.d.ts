export interface AuditRef {
  group?: string;
  id: string;
  weight: number;
}

export interface Category {
  auditRefs: AuditRef[];
  description?: string;
  id: string;
  manualDescription?: string;
  score: number;
  title: string;
}

export interface Categories {
  [name: string]: Category;
}

export interface Result {
  audits: {};
  categories: Categories;
  categoryGroups: {};
  configSettings: {};
  environment: {};
  fetchTime: string;
  finalUrl: string;
  i18n: {};
  lighthouseVersion: string;
  requestedUrl: string;
  runWarnings: string[];
  timing: {};
  userAgent: string;
}
