import renderMarkdown from '@/components/Table/renderer/markdown';
import { RendererArgs } from '@/typings/components/Table';

// one day make this more powerful and create real html from a template maybe
const renderHtml = (args: RendererArgs): string => renderMarkdown(args);

export default renderHtml;
