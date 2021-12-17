import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { FormsValidationService } from "src/app/services/forms-validation.service";

import { Field, User } from "src/app/interfaces/user";
import { UserService } from "src/app/services/user.service";

/**
 * Not functionnal, work in progress
 */

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent {
  hidePwd = true;
  private readonly _fakePwd = "********";
  user: User = this.userSvc.me;
  profileForm = this.fb.group({
    firstName: [
      this.user.firstName,
      [Validators.required, Validators.pattern("[a-zA-Z ]*")],
    ],
    lastName: [
      this.user.lastName,
      [Validators.required, Validators.pattern("[a-zA-Z ]*")],
    ],
    email: [this.user.email, [Validators.required, Validators.email]],
    password: [this._fakePwd, [Validators.required, Validators.minLength(8)]],
    dateOfBirth: [this.user.dateOfBirth, [Validators.required]],
  });
  maxDate = this.validation.limitedAge();
  profileErrors = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dateOfBirth: "",
  };

  constructor(
    private fb: FormBuilder,
    private validation: FormsValidationService,
    private userSvc: UserService
  ) {
    console.log(this.user.dateOfBirth);
  }

  onFormSubmit(): void {
    if (this.profileForm.invalid) {
      return;
    }
    const firstName = this.profileForm.get("firstName")?.value;
    const lastName = this.profileForm.get("lastName")?.value;
    const email = this.profileForm.get("email")?.value;
    const password = this.profileForm.get("password")?.value;
    const dateOfBirth = this.profileForm.get("dateOfBirth")?.value._d;
  }

  validateField(field: Field): boolean {
    const error = this.validation.validateField(this.profileForm, field);
    if (error) {
      this.profileErrors[field] = error;
      return true;
    } else {
      this.profileErrors[field] = "";
      return false;
    }
  }
}
