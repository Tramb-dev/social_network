import { Injectable } from "@angular/core";
import { SnackBarService } from "src/app/services/snack-bar.service";

@Injectable({
  providedIn: "root",
})
export class RouteMessageService {
  private _message: string | null = null;

  constructor(private snackBar: SnackBarService) {}

  get message(): string | null {
    const returnedMessage = this._message;
    this.clear();
    if (returnedMessage) {
      this.snackBar.presentSnackBar(returnedMessage, "snackBar-error", 5000);
    }
    return returnedMessage;
  }

  set message(value: string | null) {
    this._message = value;
  }

  clear() {
    this.message = null;
  }
}
