import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { MessagingService } from "src/app/services/messaging.service";

@Component({
  selector: "app-aside-messages",
  templateUrl: "./aside-messages.component.html",
  styleUrls: ["./aside-messages.component.scss"],
})
export class AsideMessagesComponent {
  discussions$ = this.msgSvc.getDiscussions();

  constructor(private msgSvc: MessagingService, private router: Router) {}

  goToDiscussion(dId: string): void {
    this.router.navigate(["member/discussion", dId]);
  }
}
