import { Component } from "@angular/core";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"],
})
export class MenuComponent {
  badges = [
    {
      anchor: "member/messages",
      label: "Messages",
      number: 4,
      visible: true,
    },
    {
      anchor: "member/friends",
      label: "Amis",
      number: 5,
      visible: true,
    },
    {
      anchor: "member/circles",
      label: "Cercles",
      number: 3,
      visible: true,
    },
    {
      anchor: "user/" + this.user.getUser().uid,
      label: "Mon profil",
      number: 0,
      visible: false,
    },
  ];

  constructor(private user: UserService) {}
}
