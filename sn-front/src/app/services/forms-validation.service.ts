import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Injectable({
  providedIn: "root",
})
export class FormsValidationService {
  private readonly _nbOfYearToLimit = 13;

  constructor() {}

  /**
   * Check if the field is correct and return the error message if needed
   * @param formRef The reference to the reactive form object
   * @param field The field checked in this form
   * @returns the error message in a string if there is an error, false otherwise
   */
  validateField(formRef: FormGroup, field: string): string | false {
    if (
      formRef.get(field)?.invalid &&
      (formRef.get(field)?.dirty || formRef.get(field)?.touched)
    ) {
      if (formRef.get(field)?.errors?.required) {
        return "Champ obligatoire";
      }
      switch (field) {
        case "firstName":
        case "lastName":
          if (formRef.get(field)?.errors?.pattern) {
            return "Ce champ ne peut contenir que des lettres";
          }
          break;

        case "email":
          if (formRef.get(field)?.errors?.email) {
            return `Le format de l'adresse est incorrect`;
          }
          break;

        case "password":
          if (
            formRef.get(field)?.errors?.minlength.actualLength <
            formRef.get(field)?.errors?.minlength.requiredLength
          ) {
            return "Le mot de passe doit contenir plus de 8 caractères";
          }
          break;

        case "confirm":
          if (formRef.get(field)?.errors?.mustMatch) {
            return `Les mots de passe ne sont pas identiques`;
          }
          break;

        case "dateOfBirth":
        default:
          return false;
      }
    }
    return false;
  }

  /**
   * Check if the passwords given are the same
   * @param pass1
   * @param pass2
   * @returns True if they are the same, false otherwise
   */
  mustMatch(pass1: string, pass2: string): boolean {
    if (pass1 === pass2) {
      return true;
    }
    return false;
  }

  /**
   * Calculate the max date to display in the calendar, given a limited age
   * @returns
   */
  limitedAge(): Date {
    const currentDate = Math.floor(Date.now() / 1000);
    const limitInSeconds = this._nbOfYearToLimit * 31557600; // 1 year in seconds
    return new Date((currentDate - limitInSeconds) * 1000);
  }
}
