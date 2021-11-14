import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { FormsValidationService } from "src/app/services/forms-validation.service";
import { CustomValidators } from "src/app/providers/custom-validators";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.scss"],
})
export class ResetPasswordComponent implements OnInit {
  passwordError = "";
  confirmError = "";
  notSameError = "";
  resetForm = new FormGroup(
    {
      password: new FormControl("", [
        Validators.minLength(8),
        Validators.required,
      ]),
      confirm: new FormControl("", [Validators.required]),
    },
    CustomValidators.mustMatch("password", "confirm")
  );

  constructor(private validation: FormsValidationService) {}

  ngOnInit(): void {}

  onFormSubmit(): void {
    const pass1: string = this.resetForm.get("password")?.value;
    const pass2: string = this.resetForm.get("confirm")?.value;
    if (this.resetForm.invalid || !this.validation.mustMatch(pass1, pass2)) {
      return;
    }
  }

  validateField(field: string): boolean {
    const error = this.validation.validateField(this.resetForm, field);
    if (field === "password") {
      if (error) {
        this.passwordError = error;
        return true;
      } else {
        this.passwordError = "";
        return false;
      }
    } else if (field === "confirm") {
      if (error) {
        this.confirmError = error;
        return true;
      } else {
        this.confirmError = "";
        return false;
      }
    }
    return false;
  }
}
