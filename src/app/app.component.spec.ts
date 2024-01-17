import { Age, AppComponent } from "./app.component";

const today = new Date;
today.setHours(0, 0, 0, 0); // Truncate to midnight

describe('Age computation', () => {
  for (const startDate = new Date(2024, 0, 10);
    startDate < today;
    startDate.setDate(startDate.getDate() + 1)
  ) {
    const year = startDate.getFullYear();
    const month = startDate.getMonth();
    const day = startDate.getDate();

    it(`should compute the age correctly for ${startDate.toDateString()}`, () => {
      const actual = AppComponent.computeAge(year, month, day);
      const expected = computeAge(year, month, day);

      expect(actual).withContext(`
        Actual: ${JSON.stringify(actual)}
        Expected: ${JSON.stringify(expected)}
      `).toEqual(expected);
    });
  }
});

const computeAge = (year: number, month: number, day: number): Age => {
  const date = new Date(year, month, day);

  let months = getMonthCount(date);
  const years = Math.floor(months / 12);
  months %= 12;
  const days = getDayCount(date);

  return { years, months, days };
}

const getMonthCount = (date: Date): number => {
  let count = 0;

  while (date < today) {
    date.setMonth(date.getMonth() + 1);
    count++;
  }

  if (date > today) {
    date.setMonth(date.getMonth() - 1);
    count--;
  }

  return count;
}

const getDayCount = (date: Date): number => {
  let count = 0;

  while (date < today) {
    date.setDate(date.getDate() + 1);
    count++;
  }

  return count;
}
