import whichCI from '@/ci';
import Config from '@/config';
import EventEmitter from '@/event';
import { namedLogger } from '@/logger';
import { outputTable } from '@/output/markdown';
import { filterReportItemsFailures } from '@/output/filter';
import { Report, ReportItem } from '@/typings/command';
import { CommandOptions } from '@/typings/utils/command';
import {
  CommentBuildStartEvent,
  CommentBuildEndEvent,
  CommentRenderTableStartEvent,
  CommentRenderTableEndEvent,
  CommentStartEvent,
  CommentEndEvent,
  CommentObject,
  Comment,
} from '@/typings/vcs/comment';

const logger = namedLogger('gimbal/vcs/comment');

const noFailuresText = 'No Failures';

const renderItem = async (
  reportItem: ReportItem,
  commandOptions: CommandOptions,
  comment: Comment,
): Promise<string> => {
  if (!reportItem.data) {
    return '';
  }

  const numFailed = reportItem.data.reduce(
    (num: number, dataItem: ReportItem): number => num + (dataItem.success ? 0 : 1),
    0,
  );

  const commentRenderTableStartEvent: CommentRenderTableStartEvent = {
    commandOptions,
    reportItem,
  };

  await EventEmitter.fire(`vcs/comment/render/table/start`, commentRenderTableStartEvent);

  const output = [];
  const { onlyFailures } = comment as CommentObject;

  if (reportItem.data && reportItem.data[0] && reportItem.data[0].data && reportItem.data[0].data.length) {
    if (onlyFailures && !numFailed) {
      output.push(noFailuresText);
    } else {
      const buffered = [`## ${reportItem.label}`];

      await Promise.all(
        reportItem.data.map(
          async (childItem: ReportItem): Promise<void> => {
            if (!onlyFailures || (onlyFailures && !childItem.success)) {
              const rendered = await outputTable(childItem, commandOptions);

              buffered.push(`### ${childItem.label}`, rendered);
            }
          },
        ),
      );

      output.push(...buffered);
    }
  } else if (onlyFailures && reportItem.success) {
    output.push(noFailuresText);
  } else {
    const rendered = await outputTable(
      onlyFailures && reportItem ? (filterReportItemsFailures(reportItem as ReportItem) as ReportItem) : reportItem,
      commandOptions,
    );

    output.push(`## ${reportItem.label}`, rendered);
  }

  const renderedTable = output.join('\n\n');

  const commentRenderTableEndEvent: CommentRenderTableEndEvent = {
    commandOptions,
    renderedTable,
    reportItem,
  };

  await EventEmitter.fire(`vcs/comment/render/table/end`, commentRenderTableEndEvent);

  return `<details><summary>${reportItem.label} (${numFailed} failure${numFailed === 1 ? '' : 's'})</summary>
<p>

${renderedTable}

</p>
</details>`;
};

const vcsComment = async (report: Report, commandOptions: CommandOptions): Promise<void> => {
  if (report.data) {
    const comment = Config.get('configs.comment', commandOptions.comment);

    if (comment) {
      const ci = whichCI();

      if (ci) {
        logger.verbose(`Detected CI: ${ci.name}`);

        const { vcs } = ci;

        if (vcs) {
          logger.verbose(`Detected VCS: ${vcs.name}`);

          const commentBuildStartEvent: CommentBuildStartEvent = {
            ci,
            report,
            vcs,
          };

          await EventEmitter.fire(`vcs/comment/build/start`, commentBuildStartEvent);

          const renderedReport = report.data
            ? await Promise.all(
                report.data.map((item: ReportItem): Promise<string> => renderItem(item, commandOptions, comment)),
              )
            : [];

          let markdown = renderedReport.join('\n\n').trim();

          const commentBuildEndEvent: CommentBuildEndEvent = {
            ci,
            markdown,
            report,
            vcs,
          };

          const { data }: { data: CommentBuildEndEvent } = await EventEmitter.fire(
            `vcs/comment/build/end`,
            commentBuildEndEvent,
          );

          if (data.markdown) {
            /* eslint-disable-next-line prefer-destructuring */
            markdown = data.markdown;
          }

          if (markdown) {
            const commentStartEvent: CommentStartEvent = {
              ci,
              comment: markdown,
              report,
              vcs,
            };

            await EventEmitter.fire(`vcs/comment/start`, commentStartEvent);

            logger.verbose('Commenting on VCS...');

            await vcs.comment(markdown);

            const commentEndEvent: CommentEndEvent = {
              ci,
              comment: markdown,
              report,
              vcs,
            };

            await EventEmitter.fire(`vcs/comment/end`, commentEndEvent);
          }
        } else {
          logger.verbose('No VCS detected');
        }
      } else {
        logger.verbose('No CI detected');
      }
    }
  }
};

export default vcsComment;
