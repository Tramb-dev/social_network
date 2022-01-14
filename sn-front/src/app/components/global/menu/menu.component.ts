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
      anchor: "discussions-list",
      label: "Messages",
      number: 4,
      visible: true,
    },
    {
      anchor: "feed",
      label: "Feed",
      number: 5,
      visible: true,
    },
    {
      anchor: "find-user",
      label: "Trouver un utilisateur",
      number: 0,
      visible: false,
    },
    {
      anchor: "wall/" + this.user.me.uid,
      label: "Mon mur",
      number: 0,
      visible: false,
    },
    {
      anchor: "my-profile",
      label: "Mon profil",
      number: 0,
      visible: false,
    },
  ];

  constructor(private user: UserService) {}
}
