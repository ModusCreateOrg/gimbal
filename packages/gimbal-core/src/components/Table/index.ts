import { TableInstanceOptions } from 'cli-table3';
import { Column, Config, Data, Finder, Renders } from '@/typings/components/Table';
import cliRenderer from './renderer/cli';
import htmlRenderer from './renderer/html';
import markdownRenderer from './renderer/markdown';

class Table {
  private columns: Column[] = [];

  private data: Data[] = [];

  private options?: TableInstanceOptions;

  public constructor(config?: Config) {
    if (config) {
      if (config.columns) {
        this.columns = config.columns;
      }

      if (config.data) {
        this.data = config.data;
      }

      if (config.options) {
        this.options = config.options;
      }
    }
  }

  public addColumn(column: Column, index?: number): void {
    const { columns } = this;

    if (index == null) {
      columns.push(column);
    } else {
      columns.splice(index, 0, column);
    }
  }

  public getColumn(index: number): Column | void {
    return this.columns[index];
  }

  public findColumn(callback: Finder, getIndex: boolean = false): Column | number | void {
    if (getIndex) {
      return this.columns.findIndex(callback);
    }

    return this.columns.find(callback);
  }

  public removeColumn(column: Column): void {
    const { columns } = this;
    const index = columns.indexOf(column);

    if (index !== -1) {
      columns.splice(index, 1);
    }
  }

  public add(item: Data, index?: number): void {
    const { data } = this;

    if (index == null) {
      data.push(item);
    } else {
      data.splice(index, 0, item);
    }
  }

  public find(callback: Finder, getIndex: boolean = false): Data | number | void {
    if (getIndex) {
      return this.data.findIndex(callback);
    }

    return this.data.find(callback);
  }

  public get(index: number): Data | void {
    return this.data[index];
  }

  public remove(item: Data): void {
    const { data } = this;
    const index = data.indexOf(item);

    if (index !== -1) {
      data.splice(index, 1);
    }
  }

  public set(data: Data[]): void {
    this.data = data;
  }

  public render(type: Renders): Promise<string> {
    const { columns, data, options } = this;

    switch (type) {
      case 'cli':
        return cliRenderer({ columns, data, options });
      case 'markdown':
        return markdownRenderer({ columns, data, options });
      case 'html':
        return htmlRenderer({ columns, data, options });
      default:
        return Promise.resolve('');
    }
  }
}

export default Table;
