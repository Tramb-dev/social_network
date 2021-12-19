import { Component } from "@angular/core";
import { Validators, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Title } from "@angular/platform-browser";

import { RegisterService } from "src/app/services/register.service";
import { FormsValidationService } from "src/app/services/forms-validation.service";
import { AuthService } from "src/app/services/auth.service";
import { SnackBarService } from "src/app/services/snack-bar.service";

import { User, Field } from "src/app/interfaces/user";
import { siteName } from "src/global-variable";

@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.scss"],
})
export class SignUpComponent {
  hidePwd = true;
  private readonly _namePattern = /^[A-Za-zÀ-ÿ '-]+$/;
  registerForm = this.fb.group({
    firstName: [
      "",
      [Validators.required, Validators.pattern(this._namePattern)],
    ],
    lastName: [
      "",
      [Validators.required, Validators.pattern(this._namePattern)],
    ],
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(8)]],
    dateOfBirth: ["", [Validators.required]],
  });
  maxDate = this.validation.limitedAge();
  registerErrors = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dateOfBirth: "",
  };
  signUpSubscription: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    private register: RegisterService,
    private router: Router,
    private validation: FormsValidationService,
    private auth: AuthService,
    private snackBar: SnackBarService,
    private title: Title
  ) {
    title.setTitle("Créer un compte - " + siteName);
  }

  onFormSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }
    const firstName = this.registerForm.get("firstName")?.value;
    const lastName = this.registerForm.get("lastName")?.value;
    const email = this.registerForm.get("email")?.value;
    const password = this.registerForm.get("password")?.value;
    const dateOfBirth = this.registerForm.get("dateOfBirth")?.value._d;
    this.signUpSubscription = this.register
      .createUser({ firstName, lastName, email, password, dateOfBirth })
      .subscribe({
        next: (user: User | null) => {
          if (user && user.isConnected) {
            this.registerForm.reset();
            this.snackBar.presentSnackBar(
              "Bienvenue chez vous",
              "snackBar-top",
              3000
            );
          } else {
            this.snackBar.presentSnackBar(
              "Adresse courriel déjà présente. Veuillez changer d'adresse ou récupérer votre mot de passe depuis la page de connexion.",
              "snackBar-error"
            );
          }
        },
        error: (err) => {
          if (404 === err.status) {
            this.snackBar.presentSnackBar(
              "Adresse courriel déjà présente. Veuillez changer d'adresse ou récupérer votre mot de passe depuis la page de connexion.",
              "snackBar-error"
            );
          } else {
            this.snackBar.presentSnackBar(
              "Une erreur s'est produite : " + err.statusText,
              "snackBar-error"
            );
            console.error(err);
          }
        },
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
