import { Injectable } from "@angular/core";
import { FormGroup, ValidationErrors } from "@angular/forms";

@Injectable({
  providedIn: "root",
})
export class CustomValidators {
  constructor() {}

  /**
   * Creates a validator to check if two fields matchs
   * Found here : https://readerstacks.com/password-and-confirm-password-validation-in-angular/
   *
   * @param controlName The first field
   * @param matchingControlName The matching field
   * @returns a formGroup with these two fields
   */
  static mustMatch(
    controlName: string,
    matchingControlName: string
  ): ValidationErrors | null {
    return (formGroup: FormGroup): ValidationErrors | null => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return null;
      }

      // set error on matchingControl if validation fails
      if (
        control.value &&
        matchingControl.value &&
        control.value !== matchingControl.value
      ) {
        matchingControl.setErrors({ mustMatch: true });
        return { mustMatch: true };
      }
      matchingControl.setErrors(null);
      return null;
    };
  }
}
