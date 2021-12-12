import { Component, OnInit } from "@angular/core";
import { RandomUser } from "src/app/interfaces/user";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-find-user",
  templateUrl: "./find-user.component.html",
  styleUrls: ["./find-user.component.scss"],
})
export class FindUserComponent implements OnInit {
  users: RandomUser[] = [];

  constructor(private user: UserService) {}

  ngOnInit(): void {
    this.user.displayUsers().subscribe((users) => {
      if (users) {
        console.log(users);
        this.users = users;
      }
    });
  }
}
