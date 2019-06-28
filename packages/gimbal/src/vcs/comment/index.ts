import Config from '@modus/gimbal-core/lib/config';
import EventEmitter from '@modus/gimbal-core/lib/event';
import whichCI from '@/ci';
import { outputTable } from '@/output/markdown';
import { Report, ReportItem } from '@/typings/command';
import { CommandOptions } from '@/typings/utils/command';
import {
  CommentBuildStartEvent,
  CommentBuildEndEvent,
  CommentRenderTableStartEvent,
  CommentRenderTableEndEvent,
  CommentStartEvent,
  CommentEndEvent,
} from '@/typings/vcs/comment';

const renderItem = async (reportItem: ReportItem, commandOptions: CommandOptions): Promise<string> => {
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

  if (reportItem.data && reportItem.data[0] && reportItem.data[0].data && reportItem.data[0].data.length) {
    const buffered = [`## ${reportItem.label}`];

    await Promise.all(
      reportItem.data.map(
        async (childItem: ReportItem): Promise<void> => {
          const rendered = await outputTable(childItem, commandOptions);

          buffered.push(`### ${childItem.label}`, rendered);
        },
      ),
    );

    output.push(...buffered);
  } else {
    const rendered = await outputTable(reportItem, commandOptions);

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
        const { vcs } = ci;

        if (vcs) {
          const commentBuildStartEvent: CommentBuildStartEvent = {
            ci,
            report,
            vcs,
          };

          await EventEmitter.fire(`vcs/comment/build/start`, commentBuildStartEvent);

          const renderedReport = await Promise.all(
            report.data.map((item: ReportItem): Promise<string> => renderItem(item, commandOptions)),
          );

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

            await vcs.comment(markdown);

            const commentEndEvent: CommentEndEvent = {
              ci,
              comment: markdown,
              report,
              vcs,
            };

            await EventEmitter.fire(`vcs/comment/end`, commentEndEvent);
          }
        }
      }
    }
  }
};

export default vcsComment;
