import { RendererArgs } from '@/typings/components/Table';
import renderMarkdown from './markdown';

// one day make this more powerful and create real html from a template maybe
const renderHtml = (args: RendererArgs): Promise<string> => renderMarkdown(args);

export default renderHtml;
