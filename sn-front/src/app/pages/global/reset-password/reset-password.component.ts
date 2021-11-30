import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";

import { CustomValidators } from "src/app/providers/custom-validators";

import { FormsValidationService } from "src/app/services/forms-validation.service";
import { RegisterService } from "src/app/services/register.service";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.scss"],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
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
  rid: string = "";
  resetSubscription!: Subscription;

  constructor(
    private validation: FormsValidationService,
    private register: RegisterService,
    private snackBar: MatSnackBar,
    private router: Router,
    private childRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const rid = this.childRoute.snapshot.paramMap.get("rid");
    if (!rid) {
      this.router.navigate(["/sign-in"]);
    } else {
      this.rid = rid;
    }
  }

  ngOnDestroy(): void {
    this.resetSubscription.unsubscribe();
  }

  onFormSubmit(): void {
    const password: string = this.resetForm.get("password")?.value;
    if (this.resetForm.invalid) {
      return;
    }

    this.resetSubscription = this.register
      .resetPassword(password, this.rid)
      .subscribe(
        (isPasswordChanged) => {
          if (isPasswordChanged) {
            this.snackBar.open("Le mot de passe a bien été changé", "Fermer", {
              duration: 3000,
              panelClass: "snackBar-top",
              verticalPosition: "top",
              horizontalPosition: "center",
            });
          } else {
            this.snackBar.open("Une erreur s'est produite", "Fermer", {
              duration: 5000,
              verticalPosition: "top",
              horizontalPosition: "center",
              panelClass: "snackBar-error",
            });
          }
        },
        (err) => {
          this.snackBar.open("Une erreur s'est produite", "Fermer");
          console.error("user sign in", err);
        }
      );
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
