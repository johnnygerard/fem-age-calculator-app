import { Directive } from '@angular/core';
import { FormGroup, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { DateInputs } from './date-inputs.type';

@Directive({
  selector: '[appDateValidator]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: DateValidatorDirective,
      multi: true
    }
  ]
})
// Cross-field validator (year, month and day inputs)
export class DateValidatorDirective implements Validator {
  validate(formGroup: FormGroup<DateInputs>): ValidationErrors | null {
    const { year: yearInput, month: monthInput, day: dayInput } = formGroup.controls;

    // Return if inputs are not all defined (not yet parsed) and valid (single-field validation)
    if (!(yearInput?.valid && monthInput?.valid && dayInput?.valid)) return null;

    const year = yearInput.value as number;
    const month = (monthInput.value as number) - 1; // Convert to zero-based
    const day = dayInput.value as number;
    const date = new Date(year, month, day);

    if (isNotInThePast(date, new Date)) return { future: true };
    if (isNonexistent(date, year, month, day))
      return { nonexistent: true };

    return null;
  }
}

export const isNotInThePast = (date: Date, today: Date): boolean => {
  today.setHours(0, 0, 0, 0); // Truncate to midnight
  return date >= today;
}

export const isNonexistent = (date: Date, year: number, month: number, day: number): boolean => {
  return date.getFullYear() !== year
    || date.getMonth() !== month
    || date.getDate() !== day;
}
