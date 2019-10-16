import { Get, GetMeta, Register } from '../module/registry';

export interface ModuleContext {
  get: Get;
  getMeta: GetMeta;
  register: Register;
}
