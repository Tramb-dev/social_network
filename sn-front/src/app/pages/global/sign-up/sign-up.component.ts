import { Component, OnInit } from "@angular/core";
import { Validators, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

import { RegisterService } from "src/app/services/register.service";
import { FormsValidationService } from "src/app/services/forms-validation.service";

import { User } from "src/app/interfaces/user";

type Field = "firstName" | "lastName" | "email" | "password" | "dateOfBirth";

@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.scss"],
})
export class SignUpComponent implements OnInit {
  hidePwd = true;
  registerForm = this.fb.group({
    firstName: ["", [Validators.required, Validators.pattern("[a-zA-Z ]*")]],
    lastName: ["", [Validators.required, Validators.pattern("[a-zA-Z ]*")]],
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(8)]],
    dateOfBirth: ["", [Validators.required]],
  });
  maxDate = this.validation.limitedAge();
  fields = ["firstName", "lastName"];
  registerErrors = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dateOfBirth: "",
  };

  constructor(
    private fb: FormBuilder,
    private register: RegisterService,
    private snackBar: MatSnackBar,
    private router: Router,
    private validation: FormsValidationService
  ) {}

  ngOnInit(): void {}

  onFormSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }
    const firstName = this.registerForm.get("firstName")?.value;
    const lastName = this.registerForm.get("lastName")?.value;
    const email = this.registerForm.get("email")?.value;
    const password = this.registerForm.get("password")?.value;
    const dateOfBirth = this.registerForm.get("dateOfBirth")?.value._d;
    this.register
      .createUser(firstName, lastName, email, password, dateOfBirth)
      .then((user: User) => {
        this.registerForm.reset();
        this.snackBar.open("Bienvenue chez vous", "Fermer", {
          duration: 3000,
          panelClass: "snackBar-top",
        });
        this.router.navigate(["/member"]);
      })
      .catch((err) => {
        this.snackBar.open("Une erreur s'est produite", "Fermer");
        console.error("userCreation", err);
      });
  }

  validateField(field: Field): boolean {
    const error = this.validation.validateField(this.registerForm, field);
    if (error) {
      this.registerErrors[field] = error;
      return true;
    } else {
      this.registerErrors[field] = "";
      return false;
    }
  }
}
