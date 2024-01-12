import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

const EPOCH = 1583; // First full Gregorian year
type Age = {
  years: number;
  months: number;
  days: number;
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  /**
   * @param month Zero-based month index
   * @param year Year
   * @returns Total number of days in the month
   */
  #getMonthDays(year: number, month: number): number {
    // Day 0 retrieves the last day of the previous month
    return new Date(year, month, 0).getDate();
  }

  computeAge(year: number, month: number, day: number): Age {
    const today = new Date();
    const birthDate = new Date(year, month, day);

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (months < 0) {
      years--;
      months += 12;
    }

    if (days < 0) {
      months--;
      days += this.#getMonthDays(today.getFullYear(), today.getMonth() - 1);
    }

    return { years, months, days };
  }

  isAgeNegative(age: Age): boolean {
    return age.years < 0 || age.months < 0 || age.days < 0;
  }

  isValidDate(year: number, month: number, day: number): boolean {
    const date = new Date(year, month, day);

    return date.getDate() === day
      && date.getMonth() === month
      && date.getFullYear() === year;
  }
}
