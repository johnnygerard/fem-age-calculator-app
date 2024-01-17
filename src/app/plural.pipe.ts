import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'plural',
  standalone: true
})
export class PluralPipe implements PipeTransform {
  // Plural form expected
  transform(value: string, quantity?: number): string {
    return quantity === 1 ? value.slice(0, -1) : value;
  }
}
