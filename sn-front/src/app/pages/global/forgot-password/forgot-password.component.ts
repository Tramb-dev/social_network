import { Component } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";

import { RegisterService } from "src/app/services/register.service";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
})
export class ForgotPasswordComponent {
  emailError = "";
  email = new FormControl("", [Validators.required, Validators.email]);

  constructor(
    private snackBar: MatSnackBar,
    private register: RegisterService
  ) {}

  onFormSubmit(): void {
    if (this.email.invalid) {
      return;
    }

    this.register
      .sendResetEmail(this.email.value)
      .then((isEmailSend: boolean) => {
        if (isEmailSend) {
          this.snackBar.open(
            "Nous venons de vous envoyer un courriel de réinitialisation. Veuillez vérifier votre boîte de réception.",
            "Fermer",
            {
              panelClass: "snackBar-top",
              verticalPosition: "top",
              horizontalPosition: "center",
            }
          );
        } else {
          this.snackBar.open("Une erreur s'est produite", "Fermer", {
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
