import { Component, OnInit } from "@angular/core";

import { LocalStorageService } from "./services/local-storage.service";
import { UserService } from "./services/user.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "Social Network";
  constructor(
    private localStorage: LocalStorageService,
    private user: UserService
  ) {}

  ngOnInit(): void {
    const token = this.localStorage.retrieveToken();
    if (token) {
      this.user.reconnect(token);
    }
  }
}
