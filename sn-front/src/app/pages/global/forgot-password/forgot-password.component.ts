import { Component, OnDestroy } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";

import { RegisterService } from "src/app/services/register.service";
import { SnackBarService } from "src/app/services/snack-bar.service";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
})
export class ForgotPasswordComponent implements OnDestroy {
  emailError = "";
  email = new FormControl("", [Validators.required, Validators.email]);

  constructor(
    private snackBar: SnackBarService,
    private register: RegisterService
  ) {}

  ngOnDestroy(): void {
    this.snackBar.dismiss();
  }

  onFormSubmit(): void {
    if (this.email.invalid) {
      return;
    }

    this.register.sendResetEmail(this.email.value).subscribe(
      (isEmailSend: boolean) => {
        if (isEmailSend) {
          this.snackBar.presentSnackBar(
            "Nous venons de vous envoyer un courriel de réinitialisation. Veuillez vérifier votre boîte de réception.",
            "snackBar-top"
          );
        } else {
          this.snackBar.presentSnackBar(
            "Une erreur s'est produite",
            "snackBar-error",
            5000
          );
        }
      },
      (err) => {
        this.snackBar.presentSnackBar(
          "Une erreur s'est produite",
          "snackBar-error"
        );
      }
    );
  }

  /**
   * Check if the email is correct and change the error message if needed
   * @returns true if there is an error, false otherwise
   */
  validateEmail(): boolean {
    if (this.email.invalid && (this.email.dirty || this.email.touched)) {
      if (this.email.errors?.required) {
        this.emailError = "Champ obligatoire";
        return true;
      } else if (this.email.errors?.email) {
        this.emailError = `Le format de l'adresse est incorrect`;
        return true;
      }
    }
    this.emailError = "";
    return false;
  }
}
