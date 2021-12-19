import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";

import { siteName } from "src/global-variable";

@Component({
  selector: "app-error404",
  templateUrl: "./error404.component.html",
  styleUrls: ["./error404.component.scss"],
})
export class Error404Component implements OnInit {
  constructor(private title: Title) {
    title.setTitle("Page non trouvée - " + siteName);
  }

  ngOnInit(): void {}
}
