import { green, red, bold } from 'colors';

export const sectionHeading = (text: string): string => bold(text);

export const successOrFailure = (item: string, success: boolean): string => (success ? green(item) : red(item));
