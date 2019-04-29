import { CellOptions } from 'cli-table3';
import { green, red, bold, Color } from 'colors';

type Item = string | CellOptions;

const colorizeItem = (item: Item, color: Color): Item => {
  if ((item as CellOptions).content != null) {
    return {
      ...(item as CellOptions),
      content: color((item as CellOptions).content as string),
    };
  }

  return color(item as string);
};

export const successOrFailure = (items: Item | Item[], success: boolean): Item | Item[] => {
  if (Array.isArray(items)) {
    return items.map((item: Item): Item => successOrFailure(item, success) as Item) as Item[];
  }

  const color = success ? green : red;

  return colorizeItem(items, color);
};

export const sectionHeading = (text: string): string => bold(text);
