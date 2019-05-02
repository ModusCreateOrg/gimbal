import whichCI from '@/ci';
import Config from '@/config';
import { outputTable } from '@/output/markdown';
import { Report, ReportItem } from '@/typings/command';
import { CommandOptions } from '@/typings/utils/command';

const renderItem = (item: ReportItem): string => {
  if (!item.data) {
    return '';
  }

  const numFailed = item.data.reduce(
    (num: number, dataItem: ReportItem): number => num + (dataItem.success ? 0 : 1),
    0,
  );

  return `<details><summary>${item.label} (${numFailed} failure${numFailed === 1 ? '' : 's'})</summary>
<p>

${outputTable(item)}

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
          const markdown = report.data.map((item: ReportItem): string => renderItem(item)).join('\n\n');

          if (markdown.trim()) {
            await vcs.comment(markdown.trim());
          }
        }
      }
    }
  }
};

export default vcsComment;
