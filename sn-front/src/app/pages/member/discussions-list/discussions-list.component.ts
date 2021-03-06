import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { MessagingService } from "src/app/services/messaging.service";

import { Discussion } from "src/app/interfaces/discussion";

@Component({
  selector: "app-discussions-list",
  templateUrl: "./discussions-list.component.html",
  styleUrls: ["./discussions-list.component.scss"],
})
export class DiscussionsListComponent {
  discussions: Discussion[] = [];
  discussions$ = this.msgSvc.getDiscussions();

  constructor(private msgSvc: MessagingService, private router: Router) {}

  goToDiscussion(dId: string): void {
    this.router.navigate(["member/discussion", dId]);
  }
}
