import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { HttpService } from "./http.service";
import { AuthService } from "./auth.service";

import { User, UserCreation } from "../interfaces/user";

@Injectable({
  providedIn: "root",
})
export class RegisterService {
  constructor(private httpService: HttpService, private auth: AuthService) {}

  createUser(user: UserCreation): Observable<User | null> {
    return this.httpService.sendSignUpRequest(user).pipe(
      map((data) => {
        if (data.body && data.body.isConnected) {
          this.auth.setConnection(data.body.isConnected);
          this.auth.setRightsLevel(data.body.rightsLevel);
        }
        return data.body;
      })
    );
  }

  sendResetEmail(emailAddress: string): Observable<boolean> {
    return this.httpService.sendForgotPasswordRequest(emailAddress).pipe(
      map((data) => {
        if (data) {
          return true;
        }
        return false;
      })
    );
  }

  async resetPassword(newPassword: string): Promise<boolean> {
    return true;
  }
}
