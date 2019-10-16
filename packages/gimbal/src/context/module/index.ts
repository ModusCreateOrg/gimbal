import registry from '../../module/registry';

import { Meta } from '@/typings/module';
import { Module } from '@/typings/module/registry';

class ModuleContext {
  get(name: string): Module | void {
    return registry.get(name);
  }

  getMeta(name: string): Meta | void {
    return registry.getMeta(name);
  }

  register(name: string, meta: Meta, mod: Module): this {
    registry.add(name, {
      fn: mod,
      meta,
    });

    return this;
  }
}

export default ModuleContext;
