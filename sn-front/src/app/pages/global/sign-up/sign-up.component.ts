import { Component, OnInit } from "@angular/core";
import { Validators, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

import { RegisterService } from "src/app/services/register.service";

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
  maxDate = this.limitedAge();
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
    private router: Router
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

  limitedAge(): Date {
    const currentDate = Math.floor(Date.now() / 1000);
    const nbOfYearToLimit = 13;
    const limitInSeconds = nbOfYearToLimit * 31557600; // 1 year in seconds
    return new Date((currentDate - limitInSeconds) * 1000);
  }

  validateField(field: Field): boolean {
    if (
      this.registerForm.get(field)?.invalid &&
      (this.registerForm.get(field)?.dirty ||
        this.registerForm.get(field)?.touched)
    ) {
      if (this.registerForm.get(field)?.errors?.required) {
        this.registerErrors[field] = "Champ obligatoire";
        return true;
      }
      switch (field) {
        case "firstName":
        case "lastName":
          if (this.registerForm.get(field)?.errors?.pattern) {
            this.registerErrors[field] =
              "Ce champ ne peut contenir que des lettres";
            return true;
          }
          break;

        case "email":
          if (this.registerForm.get("email")?.errors?.email) {
            this.registerErrors[
              "email"
            ] = `Le format de l'adresse est incorrect`;
            return true;
          }
          break;

        case "password":
          if (
            this.registerForm.get("password")?.errors?.minlength.actualLength <
            this.registerForm.get("password")?.errors?.minlength.requiredLength
          ) {
            this.registerErrors["password"] =
              "Le mot de passe doit contenir plus de 8 caractères";
            return true;
          }
          break;

        case "dateOfBirth":
        default:
          return false;
      }
    }
    this.registerErrors[field] = "";
    return false;
  }
}
