import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

import { AuthService } from "src/app/services/auth.service";
import { FormsValidationService } from "src/app/services/forms-validation.service";

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
    private snackBar: MatSnackBar,
    private validation: FormsValidationService
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

  validateField(field: string): boolean {
    const error = this.validation.validateField(this.loginForm, field);
    if (field === "email") {
      if (error) {
        this.emailError = error;
        return true;
      } else {
        this.emailError = "";
        return false;
      }
    } else if (field === "password") {
      if (error) {
        this.passwordError = error;
        return true;
      } else {
        this.passwordError = "";
        return false;
      }
    }
    return false;
  }
}
