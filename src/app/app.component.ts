import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { DateValidatorDirective } from './date-validator.directive';
import { SubmitButtonComponent } from './submit-button/submit-button.component';
import { PluralPipe } from './plural.pipe';

type Age = {
  years: number;
  months: number;
  days: number;
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DateValidatorDirective,
    SubmitButtonComponent,
    PluralPipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly EPOCH = 1583; // First full Gregorian year
  // Input values
  year?: number;
  month?: number; // One-based
  day?: number;
  units = ['years', 'months', 'days'] as const;
  output: { [key in typeof this.units[number]]?: number } = {};
  pending = false;
  get currentYear(): number {
    return new Date().getFullYear();
  }

  onSubmit(isValid: boolean | null): void {
    if (!isValid) return;

    this.pending = true;
    const month = this.month! - 1; // Convert to zero-based
    const age = this.#computeAge(this.year!, month, this.day!);
    this.#animate(age);
  }

  #computeAge(year: number, month: number, day: number): Age {
    const today = new Date;
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    let years = currentYear - year;
    let months = currentMonth - month;
    let days = currentDay - day;

    if (months < 0) {
      // Borrow a year
      years--;
      months += 12;
    }

    if (days < 0) {
      // Borrow a month
      months--;
      days += this.#getPreviousMonthDays(currentYear, currentMonth);

      if (months < 0) {
        // Borrow a year
        years--;
        months += 12;
      }
    }

    return { years, months, days };
  }

  /**
 * @param month Zero-based month
 * @param year Year
 * @returns Total number of days in the previous month
 */
  #getPreviousMonthDays(year: number, month: number): number {
    // Day 0 is shifted to the previous month's last day
    return new Date(year, month, 0).getDate();
  }

  #animate(age: Age): void {
    const { years, months, days } = age;
    const TOTAL_DURATION = 800;
    const STEPS = 50;
    const INTERVAL = TOTAL_DURATION / STEPS;
    const yearStep = years / STEPS;
    const monthStep = months / STEPS;
    const dayStep = days / STEPS;
    let i = 0;

    const intervalId = setInterval(() => {
      if (i > STEPS) {
        clearInterval(intervalId);
        this.pending = false;
        return;
      }

      this.output = {
        years: Math.round(yearStep * i),
        months: Math.round(monthStep * i),
        days: Math.round(dayStep * i),
      };

      i++;
    }, INTERVAL);
  }

  isSubmissionDisabled(form: NgForm): boolean | null {
    const controls = form.controls;
    const year = controls['year'];
    const month = controls['month'];
    const day = controls['day'];

    if (!(year && month && day)) return null;

    const allInputsAreTouchedOrDirty = (year.touched || year.dirty)
      && (month.touched || month.dirty)
      && (day.touched || day.dirty);

    return form.invalid && (form.submitted || allInputsAreTouchedOrDirty)
      || this.pending;
  }

  isRequiredError(model: NgModel, form: NgForm): boolean {
    return model.hasError('required') && (model.touched || form.submitted);
  }

  isRangeError(model: NgModel): boolean {
    return model.hasError('min') || model.hasError('max');
  }
}
