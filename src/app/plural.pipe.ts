import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'plural',
  standalone: true
})
export class PluralPipe implements PipeTransform {
  transform(value: string, quantity?: number): string {
    return value + (quantity === 1 ? '' : 's');
  }
}
