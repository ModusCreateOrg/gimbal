import { exists, resolvePath } from '@modus/gimbal-core/lib/utils/fs';
import deepmerge from 'deepmerge';
import globby from 'globby';
import { ParsedArgs } from 'minimist';
import { extname } from 'path';
import { Config as ConfigType, LoaderMap, LoadStartEvent, LoadEndEvent } from '@/typings/config';
import { Context } from '@/typings/context';
import EventEmitter from '../event';
import jsLoader from './loader/js';
import yamlLoader from './loader/yaml';
import './plugin';

interface Descriptor {
  config: string;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  defaultValue?: any;
  key: string;
}

interface GetObjectOptions {
  flatten?: boolean;
  removeProps?: string[];
}

class Config {
  private CONFIG_FILE_GLOB = '.gimbalrc.{js,json,yaml,yml}';

  private LOADERS: LoaderMap = {
    js: jsLoader,
    json: jsLoader,
    yaml: yamlLoader,
    yml: yamlLoader,
  };

  private PROP_SPLIT_RE = /\['?"?|'?"?\]\.?\[?'?"?|\./;

  private config?: ConfigType;

  private loaded = false;

  private loading = false;

  public get isLoaded(): boolean {
    return this.loaded;
  }

  public get isLoading(): boolean {
    return this.loading;
  }

  public async load(context: Context, force = false): Promise<ConfigType> {
    if (this.loaded && !force) {
      throw new Error('Configuration is already loaded!');
    }

    const config = context.args.get('config');
    const cwd = context.args.get('cwd');

    if (config) {
      const file = resolvePath(cwd, config);

      return this.doLoad(file, context, force);
    }

    const glob = resolvePath(cwd, this.CONFIG_FILE_GLOB);
    const [file] = await globby(glob);

    return this.doLoad(file, context, force);
  }

  private async doLoad(file: string, context: Context, force: boolean): Promise<ConfigType> {
    this.loading = true;

    const cwd = context.args.get('cwd');

    const loadStartEvent: LoadStartEvent = {
      Config: this,
      context,
      dir: cwd,
      file,
      force,
    };

    await EventEmitter.fire('config/load/start', loadStartEvent);

    if (file && (await exists(file))) {
      await this.loadFile(file);
    }

    const config = this.mergeArgs(context.args.get());

    this.loaded = true;
    this.loading = false;

    const loadEndEvent: LoadEndEvent = {
      Config: this,
      config,
      context,
      dir: cwd,
      file,
      force,
    };

    await EventEmitter.fire('config/load/end', loadEndEvent);

    return config;
  }

  private async loadFile(file: string): Promise<ConfigType | void> {
    const ext = extname(file).substr(1);
    const loader = this.LOADERS[ext];

    if (loader == null) {
      throw new Error('No valid gimbal configuration file found!');
    }

    this.config = await loader(file);

    return this.config;
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  public get(property: string, defaultValue?: any): any {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    let obj: any = this.config;

    const parts = property
      /**
       * Splits the property for dot and bracket notations:
       *
       *  - foo.bar
       *  - foo[1]
       *  - foo[0].bar
       *  - foo[0][1]
       *  - foo[0][3].bar.1.baz
       *  - foo['bar][1].baz
       *  - foo.bar[0]["baz"]
       *
       * For brackets, it will split on the bracket so the
       * part is whatever is between the brackets (number for
       * array, even text for object).
       */
      .split(this.PROP_SPLIT_RE)
      /**
       * Removes any empty strings that can occur
       * with bracket notation.
       */
      .filter(Boolean);

    while (obj && parts.length > 0) {
      const prop = parts.shift() as string;

      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      obj = obj[prop];
    }

    /**
     * It's ok if defaultValue is null/undefined, deepmerge handles that.
     * obj does need to be defined so default to an object.
     * Reason to always run this, it creates new objects instead of using
     * the defaultValue that could be changed by something downstream
     * which could pose an issue.
     */
    return this.maybeMerge(defaultValue, obj);
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  public set(property: string, value: any): this {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    let obj: any = this.ensureConfig();

    const parts = property
      /**
       * Splits the property for dot and bracket notations:
       *
       *  - foo.bar
       *  - foo[1]
       *  - foo[0].bar
       *  - foo[0][1]
       *  - foo[0][3].bar.1.baz
       *  - foo['bar][1].baz
       *  - foo.bar[0]["baz"]
       *
       * For brackets, it will split on the bracket so the
       * part is whatever is between the brackets (number for
       * array, even text for object).
       */
      .split(this.PROP_SPLIT_RE)
      /**
       * Removes any empty strings that can occur
       * with bracket notation.
       */
      .filter(Boolean);

    while (parts.length > 0) {
      const prop = parts.shift() as string;

      if (parts.length === 0) {
        obj[prop] = value;

        break;
      }

      if (obj[prop] == null) {
        obj[prop] = {};
      }

      obj = obj[prop];
    }

    return this;
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  public getObject(descriptors: Descriptor[], options?: GetObjectOptions): any {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    let obj: any = {};

    descriptors.forEach((descriptor: Descriptor): void => {
      const value = this.get(descriptor.config, descriptor.defaultValue);

      // TODO support nested key
      obj[descriptor.key] = value;
    });

    if (options) {
      if (options.flatten) {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const newObj: any = {};

        Object.keys(obj).forEach((key: string): void => {
          const value = obj[key];

          if (typeof value === 'object' && !Array.isArray(value)) {
            Object.assign(newObj, value);
          } else {
            newObj[key] = value;
          }
        });

        obj = newObj;
      }

      if (options.removeProps && options.removeProps.length > 0) {
        options.removeProps.forEach((key: string): void => {
          delete obj[key];
        });
      }
    }

    return obj;
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  private maybeMerge(defaultValue?: any, obj?: any): any {
    if ((typeof defaultValue === 'object' && defaultValue) || (typeof obj === 'object' && obj)) {
      return deepmerge(defaultValue || this.parseObject(obj), obj || this.parseObject(defaultValue));
    }

    return obj == null ? defaultValue : obj;
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  private parseObject(defaultValue: any): any {
    if (typeof defaultValue === 'object') {
      if (Array.isArray(defaultValue)) {
        return [];
      }

      return {};
    }

    return defaultValue;
  }

  private ensureConfig(): ConfigType {
    if (!this.config) {
      this.config = {};
    }

    return this.config;
  }

  public mergeArgs(args: ParsedArgs): ConfigType {
    const config = this.ensureConfig();

    Object.keys(args)
      .filter((arg: string): boolean => arg !== '_')
      .forEach((arg: string): void => {
        const property = `configs.${arg}`;

        // only apply arg value if config is not set in config file
        if (this.get(property) == null) {
          this.set(property, args[arg]);
        }
      });

    return config;
  }
}

export default new Config();
