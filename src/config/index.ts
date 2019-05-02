import deepmerge from 'deepmerge';
import globby from 'globby';
import { extname } from 'path';
import { resolvePath } from '@/utils/fs';
import jsLoader from './loader/js';
import yamlLoader from './loader/yaml';
import parsePlugins from './plugin';

import { Config as ConfigType, LoaderMap } from '@/typings/config';

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

  public async load(dir: string, force: boolean = false): Promise<ConfigType | void> {
    if (this.loaded && !force) {
      throw new Error('Configuration is already loaded!');
    }

    const glob = resolvePath(dir, this.CONFIG_FILE_GLOB);
    const [file] = await globby(glob);

    if (!file) {
      return undefined;
    }

    const ext = extname(file).substr(1);
    const loader = this.LOADERS[ext];

    if (loader == null) {
      throw new Error('No valid gimbal configuration file found!');
    }

    this.loading = true;

    this.config = await loader(file);

    this.loaded = true;
    this.loading = false;

    await this.onLoad(dir);

    return this.config;
  }

  private async onLoad(dir: string): Promise<void> {
    const { config } = this;

    if (!config) {
      return undefined;
    }

    const { plugins } = config;

    if (plugins && plugins.length) {
      await parsePlugins(plugins, dir);
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
  private maybeMerge(defaultValue?: any, obj?: any): any {
    if ((typeof defaultValue === 'object' && defaultValue) || (typeof obj === 'object' && obj)) {
      return deepmerge(defaultValue, obj || this.parseObject(defaultValue));
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
