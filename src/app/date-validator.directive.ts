import { Directive } from '@angular/core';
import { AbstractControl, FormGroup, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

type NumberInputs = {
  day: AbstractControl<number>;
  month: AbstractControl<number>;
  year: AbstractControl<number>;
};

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
export class DateValidatorDirective implements Validator {
  validate(formGroup: FormGroup<NumberInputs>): ValidationErrors | null {
    const year = formGroup.controls.year.value;
    const month = formGroup.controls.month.value;
    const day = formGroup.controls.day.value;
    const date = new Date(year, month, day);

    const today = new Date;
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    // Date should not be in the future
    if (year === currentYear && (
      month > currentMonth || (month === currentMonth && day > currentDay)
    )) return { future: true };

    // Date should exist
    // The Date constructor shifts invalid dates (e.g. from Feb 29, 1991 to Mar 1, 1991)
    if (date.getFullYear() !== year
      || date.getMonth() !== month
      || date.getDate() !== day
    ) return { nonexistent: true };

    return null;
  }
}
