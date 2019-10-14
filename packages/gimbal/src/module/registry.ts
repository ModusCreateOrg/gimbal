import Manager from '@modus/gimbal-core/lib/Manager';
import { Module } from '@/typings/module/registry';
import { Meta } from '@/typings/module';

class ModuleManager extends Manager {
  get(name: string): Module | void {
    const info = super.get(name);

    return info && info.fn;
  }

  getMeta(name: string): Meta | void {
    const info = super.get(name);

    return info && info.meta;
  }

  register(name: string, meta: Meta, mod: Module): void {
    return this.add(name, {
      fn: mod,
      meta,
    });
  }
}

const registry = new ModuleManager({
  name: 'module',
});

export default registry;
