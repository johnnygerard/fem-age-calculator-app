import { AbstractControl } from "@angular/forms";

// Controls are marked optional because they are undefined until parsed
export type DateInputs = {
  year?: AbstractControl<number | undefined>;
  month?: AbstractControl<number | undefined>;
  day?: AbstractControl<number | undefined>;
};
