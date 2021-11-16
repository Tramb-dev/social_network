import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class SnackBarService {
  constructor(private snackBar: MatSnackBar) {}

  /**
   * Present a snackBar over the content
   * @param message The message to display
   * @param panelClass classes available: snackBar-error | snackBar-top
   * @param duration optional, if set the time to display the snackBar
   */
  presentSnackBar(
    message: string,
    panelClass: string,
    duration?: number
  ): void {
    const options: MatSnackBarConfig<any> = {
      verticalPosition: "top",
      horizontalPosition: "center",
      panelClass: panelClass,
    };

    if (duration) {
      options.duration = duration;
    }

    this.snackBar.open(message, "Fermer", options);
  }

  dismiss(): void {
    this.snackBar.dismiss();
  }
}
