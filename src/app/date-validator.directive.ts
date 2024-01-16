import { Directive } from '@angular/core';
import { AbstractControl, FormGroup, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

// Controls are marked optional because they are undefined until parsed
type DateInputs = {
  year?: AbstractControl<number | undefined>;
  month?: AbstractControl<number | undefined>;
  day?: AbstractControl<number | undefined>;
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
    const today = new Date;

    // Dates must be in the past
    today.setHours(0, 0, 0, 0); // Truncate to midnight
    if (date >= today) return { future: true };

    // Dates must exist
    // The Date constructor shifts nonexistent dates (e.g. from Feb 29, 1991 to Mar 1, 1991)
    if (date.getFullYear() !== year
      || date.getMonth() !== month
      || date.getDate() !== day
    ) return { nonexistent: true };

    return null;
  }
}
