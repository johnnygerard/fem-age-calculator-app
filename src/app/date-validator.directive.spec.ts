import { isNonexistent, isNotInThePast } from './date-validator.directive';

describe('DateValidatorDirective', () => {
  describe('isNotInThePast', () => {
    const now = new Date;

    it('should return true if the date is in the future', () => {
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

      expect(isNotInThePast(tomorrow)).toEqual(true);
    });

    it('should return true if the date is today', () => {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      expect(isNotInThePast(today)).toEqual(true);
    });

    it('should return false if the date is in the past', () => {
      const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

      expect(isNotInThePast(yesterday)).toEqual(false);
    });
  });

  describe('isNonexistent', () => {
    it('should validate the number of days in a month', () => {
      const year = 2021;
      const month = 3; // April
      const day = 31;
      const date = new Date(year, month, day);

      expect(isNonexistent(date, year, month, day)).toEqual(true);
    });

    it('should validate leap years', () => {
      const year = 1900; // Not a leap year (divisible by 100 but not by 400)
      const month = 1; // February
      const day = 29;
      const date = new Date(year, month, day);

      expect(isNonexistent(date, year, month, day)).toEqual(true);
    });

    it('should return false if the date is valid', () => {
      const year = 2000; // Leap year (divisible by 400)
      const month = 1; // February
      const day = 29;
      const date = new Date(year, month, day);

      expect(isNonexistent(date, year, month, day)).toEqual(false);
    });
  });
});
