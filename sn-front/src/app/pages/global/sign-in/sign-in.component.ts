import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-sign-in",
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.scss"],
})
export class SignInComponent implements OnInit, OnDestroy {
  hidePwd = true;
  loginForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(8),
    ]),
  });
  emailError = "";
  passwordError = "";

  constructor(
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.auth.isUserLoggedIn().then((isLoggedIn: boolean) => {
      if (isLoggedIn) {
        // TODO: décommenter pour prod
        //this.router.navigate(["/member"]);
      }
    });
  }

  ngOnDestroy() {
    this.snackBar.dismiss();
  }

  onFormSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    const userEmail = this.loginForm.get("email")?.value;
    const userPwd = this.loginForm.get("password")?.value;
    this.auth
      .signInUser(userEmail, userPwd)
      .then((isAuthenticated: boolean) => {
        if (isAuthenticated) {
          this.loginForm.reset();
          this.snackBar.open(
            "Connexion réussie, heureux de vous revoir",
            "Fermer",
            { duration: 1500, panelClass: "snackBar-top" }
          );
          this.router.navigate(["/member"]);
        } else {
          this.snackBar.open("Veuillez vérifier vos identifiants", "X", {
            duration: 5000,
            verticalPosition: "top",
            horizontalPosition: "center",
            panelClass: "snackBar-error",
          });
        }
      })
      .catch((err) => {
        this.snackBar.open("Une erreur s'est produite", "Fermer");
        console.error("user sign in", err);
      });
  }

  /**
   * Check if the email is correct and change the error message if needed
   * @returns true if there is an error, false otherwise
   */
  validateEmail(): boolean {
    if (
      this.loginForm.get("email")?.invalid &&
      (this.loginForm.get("email")?.dirty ||
        this.loginForm.get("email")?.touched)
    ) {
      if (this.loginForm.get("email")?.errors?.required) {
        this.emailError = "Champ obligatoire";
        return true;
      } else if (this.loginForm.get("email")?.errors?.email) {
        this.emailError = `Le format de l'adresse est incorrect`;
        return true;
      }
    }
    this.emailError = "";
    return false;
  }

  /**
   * Check if the password is correct and change the error message if needed
   * @returns true if there is an error, false otherwise
   */
  validatePassword(): boolean {
    if (
      this.loginForm.get("password")?.invalid &&
      (this.loginForm.get("password")?.dirty ||
        this.loginForm.get("password")?.touched)
    ) {
      if (this.loginForm.get("password")?.errors?.required) {
        this.passwordError = "Champ obligatoire";
        return true;
      } else if (
        this.loginForm.get("password")?.errors?.minlength.actualLength <
        this.loginForm.get("password")?.errors?.minlength.requiredLength
      ) {
        this.passwordError =
          "Le mot de passe doit contenir plus de 8 caractères";
        return true;
      }
    }
    this.passwordError = "";
    return false;
  }
}
