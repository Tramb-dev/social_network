import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { registerLocaleData } from "@angular/common";
import localeFr from "@angular/common/locales/fr";

import { MessagingService } from "src/app/services/messaging.service";
import { UserService } from "src/app/services/user.service";

import { Message } from "src/app/interfaces/message";

registerLocaleData(localeFr, "fr");

@Component({
  selector: "app-discussion",
  templateUrl: "./discussion.component.html",
  styleUrls: ["./discussion.component.scss"],
})
export class DiscussionComponent implements OnInit {
  messageForm = new FormControl("");
  messages: Message[] = [];
  private discussionId: string = "";

  constructor(
    private messagingSvc: MessagingService,
    private route: ActivatedRoute,
    private user: UserService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((queryParam) => {
      const discussionId = queryParam.get("did");
      if (discussionId) {
        this.discussionId = discussionId;
        this.messagingSvc.getPrivateMessages(discussionId);
      }
    });
  }

  publish() {
    // TODO: adapt after setting backend response
    const newMessage = {
      uId: this.user.me.uid,
      date: new Date(),
      content: this.messageForm.value,
      dId: this.discussionId,
      mId: Math.random().toString(),
    };
    this.messages.push(newMessage);
  }
}
