import { Age, AppComponent, EPOCH } from "./app.component";

const today = new Date;
today.setHours(0, 0, 0, 0); // Truncate to midnight

describe('Age computation', () => {
  // // This test loop stops on failure but is slower.
  // for (const birthDate = new Date(1999, 0, 1); // Total running time: 1.639s
  //   birthDate < today;
  //   birthDate.setDate(birthDate.getDate() + 1)
  // ) {
  //   const birthDateInput = [
  //     birthDate.getFullYear(),
  //     birthDate.getMonth(),
  //     birthDate.getDate()
  //   ] as const;

  //   it(`should compute the age correctly for ${birthDate.toDateString()}`, () => {
  //     const age = AppComponent.computeAge(...birthDateInput);

  //     expect(validateAge(age, ...birthDateInput)).toBeTrue();
  //   });
  // }

  // This test does not stop on failure but runs faster.
  it('should compute the age correctly', () => {
    for (const birthDate = new Date(EPOCH, 0, 1); // Total running time: 0.449s
      birthDate < today;
      birthDate.setDate(birthDate.getDate() + 1)
    ) {
      const birthDateInput = [
        birthDate.getFullYear(),
        birthDate.getMonth(),
        birthDate.getDate()
      ] as const;

      const age = AppComponent.computeAge(...birthDateInput);

      expect(isAgeValid(age, ...birthDateInput)).toBeTrue();
    }
  });
});

const isAgeValid = (
  age: Age,
  birthYear: number,
  birthMonth: number,
  birthDay: number
): boolean => {
  let year = birthYear + age.years;
  let month = birthMonth + age.months;
  const day = birthDay + age.days;

  if (month > 11) {
    year += 1;
    month -= 12;
  }

  return today.valueOf() === new Date(year, month, day).valueOf();
};
