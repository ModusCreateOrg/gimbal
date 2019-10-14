/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type Instance = any;

interface Config {
  name: string;
}

type FindCallback = (name: string, item: Instance) => boolean;

class Manager {
  private instances = new Map<string, Instance>();

  private name: string;

  constructor(config: Config) {
    this.name = config.name;
  }

  add(name: string, instance: Instance): void {
    if (this.get(name)) {
      throw new Error(`An instance with the name "${name}" already exists in the ${this.name} manager.`);
    }

    this.instances.set(name, instance);
  }

  get(name: string): Instance | void {
    return this.instances.get(name);
  }

  delete(name: string): boolean {
    return this.instances.delete(name);
  }

  find(cb: FindCallback): Instance | void {
    return Array.from(this.instances.entries()).find(([key, value]) => cb(key, value));
  }
}

export default Manager;
