import { Component, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Title } from "@angular/platform-browser";

import { AuthService } from "src/app/services/auth.service";
import { FormsValidationService } from "src/app/services/forms-validation.service";
import { UserService } from "src/app/services/user.service";
import { SnackBarService } from "src/app/services/snack-bar.service";

import { User } from "src/app/interfaces/user";
import { siteName } from "src/global-variable";

@Component({
  selector: "app-sign-in",
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.scss"],
})
export class SignInComponent implements OnDestroy {
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
  signInSubscription: Subscription | undefined;

  constructor(
    private auth: AuthService,
    private router: Router,
    private validation: FormsValidationService,
    private snackBar: SnackBarService,
    private userSrv: UserService,
    private title: Title
  ) {
    title.setTitle("Connexion - " + siteName);
  }

  ngOnDestroy() {
    this.snackBar.dismiss();
    if (this.signInSubscription) {
      this.signInSubscription.unsubscribe();
    }
  }

  onFormSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    const userEmail = this.loginForm.get("email")?.value;
    const userPwd = this.loginForm.get("password")?.value;
    this.signInSubscription = this.auth
      .signInUser(userEmail, userPwd)
      .subscribe({
        next: (user: User | null) => {
          if (user && user.isConnected) {
            this.userSrv.me = user;
            this.loginForm.reset();
            this.snackBar.presentSnackBar(
              "Connexion réussie, heureux de vous revoir",
              "snackBar-top",
              1500
            );
            this.router.navigate(["member/wall/", user.uid]);
          } else {
            this.snackBar.presentSnackBar(
              "Veuillez vérifier vos identifiants",
              "snackBar-error",
              5000
            );
          }
        },
        error: (err) => {
          if (404 === err.status) {
            this.snackBar.presentSnackBar(
              "Veuillez vérifier vos identifiants",
              "snackBar-error",
              5000
            );
          } else {
            this.snackBar.presentSnackBar(
              "Une erreur s'est produite : " + err,
              "snackBar-error"
            );
          }
        },
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
