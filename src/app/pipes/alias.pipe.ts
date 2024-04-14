import { Pipe, PipeTransform } from '@angular/core';
/*
 * Returns a string in 'alias' format
 * Converts string to lowercase, replaces spaces with hyphens and removes special characters.
 */
@Pipe({ name: 'alias' })
export class AliasPipe implements PipeTransform {
  transform(value: string): string {
    return value
      .replace(/[^a-zA-Z ]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase();
  }
}
