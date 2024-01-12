import { Directive } from '@angular/core';
import { AbstractControl, FormGroup, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

// Controls are initially undefined until parsed
type NumberInputs = {
  year?: AbstractControl<number>;
  month?: AbstractControl<number>;
  day?: AbstractControl<number>;
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
    const controls = formGroup.controls;

    if (!controls.year || !controls.month || !controls.day)
      return null;

    const year = controls.year.value;
    const month = controls.month.value - 1; // Convert to zero-based
    const day = controls.day.value;
    const date = new Date(year, month, day);

    const today = new Date;
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    // Dates must be in the past
    if (year === currentYear && (
      month > currentMonth || (month === currentMonth && day >= currentDay)
    )) return { future: true };

    // Dates must exist
    // The Date constructor shifts nonexistent dates (e.g. from Feb 29, 1991 to Mar 1, 1991)
    if (date.getFullYear() !== year
      || date.getMonth() !== month
      || date.getDate() !== day
    ) return { nonexistent: true };

    return null;
  }
}
