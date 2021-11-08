import { Component } from "@angular/core";

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
      anchor: "member",
      label: "Mon profil",
      number: 0,
      visible: false,
    },
  ];

  constructor() {}
}
