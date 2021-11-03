import { Component } from "@angular/core";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"],
})
export class MenuComponent {
  badges = [
    {
      field: "messages",
      label: "Messages",
      number: 4,
      visible: true,
    },
    {
      field: "friends",
      label: "Amis",
      number: 5,
      visible: true,
    },
    {
      field: "circle",
      label: "Cercles",
      number: 3,
      visible: true,
    },
    {
      field: "profil",
      label: "Mon profil",
      number: 0,
      visible: false,
    },
  ];

  constructor() {}
}
