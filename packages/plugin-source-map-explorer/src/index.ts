import deepmerge from 'deepmerge';
import { PluginOptions } from '@/typings/config/plugin';
import { BundleObject, BundleType, Config, defaultConfig } from './config';
import { registerModule } from './mod';

const arrayMerge = (destinationArray: BundleType[], sourceArray: BundleType[]): BundleType[] => {
  const newDestArray = destinationArray.slice();

  sourceArray.forEach((sourceItem: BundleType): void => {
    const isSourceString = typeof sourceItem === 'string';
    const match: BundleType | void = newDestArray.find((destItem: BundleType): boolean => {
      if (typeof destItem === 'string') {
        if (isSourceString) {
          return destItem === sourceItem;
        }

        return destItem === (sourceItem as BundleObject).path;
      }

      if (isSourceString) {
        return destItem === sourceItem;
      }

      return (destItem as BundleObject).path === (sourceItem as BundleObject).path;
    });

    if (match) {
      if (typeof match === 'string') {
        // if the match in the newDestArray is a string, we can simply replace it
        // with the sourceItem regardless if the sourceItem is a string or not
        newDestArray.splice(newDestArray.indexOf(match), 1, sourceItem);
      } else if (!isSourceString) {
        // apply sourceItem onto the match in the newDestArray if
        // sourceItem is an object, not a string
        Object.assign(match, sourceItem);
      }
    } else {
      // is a new item
      newDestArray.push(sourceItem);
    }
  });

  return newDestArray;
};

const SourceMapExplorer = async (pluginOptions: PluginOptions, config: Config): Promise<void> => {
  const pluginConfig: Config = deepmerge(defaultConfig, config, {
    arrayMerge,
  });

  const catchAll = pluginConfig.bundles.filter((bundleConfig: BundleType): boolean =>
    typeof bundleConfig === 'string' ? bundleConfig === '**/*.js' : (bundleConfig as BundleObject).path === '**/*.js',
  );
  const exclusions = pluginConfig.bundles.filter((bundleConfig: BundleType): boolean =>
    typeof bundleConfig === 'string' ? bundleConfig[0] === '!' : (bundleConfig as BundleObject).path[0] === '!',
  );
  const inclusions = pluginConfig.bundles.filter((bundleConfig: BundleType): boolean => {
    if (typeof bundleConfig === 'string') {
      return bundleConfig[0] !== '!' && bundleConfig !== '**/*.js';
    }

    return (bundleConfig as BundleObject).path[0] !== '!' && (bundleConfig as BundleObject).path !== '**/*.js';
  });

  // we need to order the bundle configs. The first group is the inclusions, next is the catch all,
  // next the exclusions.
  pluginConfig.bundles = [...inclusions, ...catchAll, ...exclusions];

  registerModule(pluginOptions, pluginConfig);
};

export default SourceMapExplorer;
