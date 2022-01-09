import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { registerLocaleData } from "@angular/common";
import localeFr from "@angular/common/locales/fr";
import { Observable, of, Subscription, switchMap } from "rxjs";

import { MessagingService } from "src/app/services/messaging.service";
import { UserService } from "src/app/services/user.service";

import { Message } from "src/app/interfaces/message";
import { Discussion } from "src/app/interfaces/discussion";

registerLocaleData(localeFr, "fr");

@Component({
  selector: "app-discussion",
  templateUrl: "./discussion.component.html",
  styleUrls: ["./discussion.component.scss"],
})
export class DiscussionComponent implements OnInit, OnDestroy {
  messageForm = new FormControl("");
  messages: Message[] = [];
  private discussion?: Discussion;
  private discussionId: string = "";
  private discussion$ = Subscription.EMPTY;

  constructor(
    private messagingSvc: MessagingService,
    private route: ActivatedRoute,
    private user: UserService
  ) {}

  ngOnInit(): void {
    this.discussion$ = this.route.paramMap
      .pipe(
        switchMap<ParamMap, Observable<Discussion | null>>((params) => {
          const discussionId = params.get("did");
          if (discussionId) {
            this.discussionId = discussionId;
            return this.messagingSvc.getMessages(discussionId);
          }
          return of(null);
        })
      )
      .subscribe((discussion) => {
        if (discussion) {
          this.messages = discussion.messages;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.discussion$) {
      this.discussion$.unsubscribe();
    }
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
    this.messagingSvc.sendMessage(this.discussionId, this.messageForm.value);
  }
}
