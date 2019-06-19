import { Module } from '@/typings/module/registry';

const registry = new Map<string, Module>();

export const register = (name: string, mod: Module): void => {
  registry.set(name, mod);
};

export const unregister = (name: string): boolean => registry.delete(name);

export const get = (name: string): Module | void => registry.get(name);
