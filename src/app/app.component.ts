import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DateValidatorDirective } from './date-validator.directive';

type Age = {
  years: number;
  months: number;
  days: number;
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, DateValidatorDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly EPOCH = 1583; // First full Gregorian year
  readonly DEFAULT_OUTPUT = '- -';
  year?: number;
  month?: number; // One-based
  day?: number;
  years?: number;
  months?: number;
  days?: number;
  get currentYear(): number {
    return new Date().getFullYear();
  }

  onSubmit(): void {
    const age = this.#computeAge(this.year!, this.month! - 1, this.day!);

    // Set output
    this.years = age.years;
    this.months = age.months;
    this.days = age.days;
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
}
