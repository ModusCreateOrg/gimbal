import { Config } from '@/typings/config';
import { Config as v1config } from '@/typings/config/versions/1';

interface AuditObject {
  [name: string]: unknown;
}

const findPlugin = (plugin: string, plugins?: string[]): unknown =>
  plugins?.find(
    (pluginConfig: unknown): boolean =>
      pluginConfig === plugin ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (pluginConfig as any).plugin === plugin,
  );

const handler = (rawconfig: v1config): Config => {
  const { audits, configs, plugins } = rawconfig;

  if (audits && audits.length) {
    const newAudits: AuditObject = {};

    audits.forEach((audit: string): void => {
      switch (audit.toLowerCase()) {
        case 'axe':
          // eslint-disable-next-line no-case-declarations
          const axePlugin: unknown = findPlugin('@modus/gimbal-plugin-axe', plugins);

          if (axePlugin) {
            newAudits[audit] = {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              thresholds: (axePlugin as any).thresholds,
            };
          } else {
            newAudits[audit] = true;
          }

          break;
        case 'source-map-explorer':
          // eslint-disable-next-line no-case-declarations
          const sourceMapPlugin: unknown = findPlugin('@modus/gimbal-plugin-source-map-explorer', plugins);

          if (sourceMapPlugin) {
            newAudits[audit] = {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              bundles: (sourceMapPlugin as any).bundles,
            };
          } else {
            newAudits[audit] = true;
          }

          break;
        default:
          if (configs) {
            // eslint-disable-next-line no-case-declarations,@typescript-eslint/no-explicit-any
            const config: any | void = configs[audit];

            if (config) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const auditObj: any = {};

              if (config.threshold) {
                auditObj.threshold = config.threshold;
              } else if (config.thresholds) {
                auditObj.threshold = config.thresholds;
              }

              newAudits[audit] = auditObj;

              break;
            }
          }

          newAudits[audit] = true;
      }
    });

    const config: Config = {
      ...rawconfig,
      audits: newAudits,
      version: 1,
    };

    return config;
  }

  return rawconfig as Config;
};

export default handler;
