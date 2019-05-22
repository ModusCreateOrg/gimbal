import deepmerge from 'deepmerge';
import globby from 'globby';
import { extname } from 'path';
import EventEmitter from '@/shared/event';
import { exists, resolvePath } from '@/shared/utils/fs';
import {
  Config as ConfigType,
  LoaderMap,
  LoadStartEvent,
  LoadEndEvent,
  PluginStartEvent,
  PluginEndEvent,
} from '@/typings/config';
import { CommandOptions } from '@/typings/utils/command';
import jsLoader from './loader/js';
import yamlLoader from './loader/yaml';
import parsePlugins from './plugin';

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
  private CONFIG_FILE_GLOB: string = '.gimbalrc.{js,json,yaml,yml}';

  private LOADERS: LoaderMap = {
    js: jsLoader,
    json: jsLoader,
    yaml: yamlLoader,
    yml: yamlLoader,
  };

  private PROP_SPLIT_RE = /\['?"?|'?"?\]\.?\[?'?"?|\./;

  private config?: ConfigType;

  private loaded: boolean = false;

  private loading: boolean = false;

  public get isLoaded(): boolean {
    return this.loaded;
  }

  public get isLoading(): boolean {
    return this.loading;
  }

  public async load(dir: string, commandOptions: CommandOptions, force: boolean = false): Promise<ConfigType | void> {
    if (this.loaded && !force) {
      throw new Error('Configuration is already loaded!');
    }

    if (commandOptions.config) {
      const file = resolvePath(commandOptions.cwd, commandOptions.config);

      if (await exists(file)) {
        return this.loadFile(dir, file, commandOptions, force);
      }

      return undefined;
    }

    const glob = resolvePath(dir, this.CONFIG_FILE_GLOB);
    const [file] = await globby(glob);

    if (!file) {
      return undefined;
    }

    return this.loadFile(dir, file, commandOptions, force);
  }

  public async loadFile(
    dir: string,
    file: string,
    commandOptions: CommandOptions,
    force: boolean,
  ): Promise<ConfigType | void> {
    const ext = extname(file).substr(1);
    const loader = this.LOADERS[ext];

    if (loader == null) {
      throw new Error('No valid gimbal configuration file found!');
    }

    this.loading = true;

    const loadStartEvent: LoadStartEvent = {
      Config: this,
      file,
      force,
    };

    await EventEmitter.fire('config/load/start', loadStartEvent);

    this.config = await loader(file);

    const loadEndEvent: LoadEndEvent = {
      Config: this,
      config: this.config,
      file,
      force,
    };

    await EventEmitter.fire('config/load/end', loadEndEvent);

    this.loaded = true;
    this.loading = false;

    await this.onLoad(dir, commandOptions);

    return this.config;
  }

  private async onLoad(dir: string, commandOptions: CommandOptions): Promise<void> {
    const { config } = this;

    if (!config) {
      return undefined;
    }

    const { plugins } = config;

    if (plugins && plugins.length) {
      const pluginStartEvent: PluginStartEvent = {
        Config: this,
        dir,
        plugins,
      };

      await EventEmitter.fire('config/plugin/start', pluginStartEvent);

      await parsePlugins(plugins, dir, commandOptions);

      const pluginEndEvent: PluginEndEvent = {
        Config: this,
        dir,
        plugins,
      };

      await EventEmitter.fire('config/plugin/end', pluginEndEvent);
    }

    return undefined;
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
      obj = obj[prop] as any;
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
  public getObject(descriptors: Descriptor[], options?: GetObjectOptions): any {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    let obj: any = {};

    descriptors.forEach(
      (descriptor: Descriptor): void => {
        const value = this.get(descriptor.config, descriptor.defaultValue);

        // TODO support nested key
        obj[descriptor.key] = value;
      },
    );

    if (options) {
      if (options.flatten) {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const newObj: any = {};

        Object.keys(obj).forEach(
          (key: string): void => {
            const value = obj[key];

            if (typeof value === 'object' && !Array.isArray(value)) {
              Object.assign(newObj, value);
            } else {
              newObj[key] = value;
            }
          },
        );

        obj = newObj;
      }

      if (options.removeProps && options.removeProps.length > 0) {
        options.removeProps.forEach(
          (key: string): void => {
            delete obj[key];
          },
        );
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
}

export default new Config();
