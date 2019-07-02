import { ModuleInfo, Module } from '@/typings/module/registry';
import { Meta } from '@/typings/module';

const registry = new Map<string, ModuleInfo>();

export const register = (name: string, meta: Meta, mod: Module): void => {
  registry.set(name, {
    fn: mod,
    meta,
  });
};

export const unregister = (name: string): boolean => registry.delete(name);

export const get = (name: string): Module | void => {
  const info = registry.get(name);

  return info && info.fn;
};

export const getMeta = (name: string): Meta | void => {
  const info = registry.get(name);

  return info && info.meta;
};
