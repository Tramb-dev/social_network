import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { registerLocaleData } from "@angular/common";
import localeFr from "@angular/common/locales/fr";
import {
  concat,
  map,
  Observable,
  of,
  Subscription,
  switchMap,
  tap,
} from "rxjs";

import { MessagingService } from "src/app/services/messaging.service";
import { UserService } from "src/app/services/user.service";

import { Message, NewMessage } from "src/app/interfaces/message";
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
        switchMap<ParamMap, Observable<Message[] | null>>((params) => {
          const discussionId = params.get("did");
          if (discussionId) {
            this.discussionId = discussionId;
            const discussion$ = this.messagingSvc
              .getDiscussion(discussionId)
              .pipe(
                tap((discussion) => (this.discussion = discussion)),
                map((discussion) => discussion.messages)
              );
            const newMessage$ = this.messagingSvc
              .getMessages(discussionId)
              .pipe(
                map((newMessage) => {
                  const messages = this.messages;
                  if (newMessage.dId === discussionId) {
                    messages.push(newMessage.message);
                  }
                  return messages;
                })
              );
            return concat(discussion$, newMessage$);
          }
          return of(null);
        })
      )
      .subscribe((messages) => {
        if (messages) {
          this.messages = messages;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.discussion$) {
      this.discussion$.unsubscribe();
    }
  }

  publish() {
    const newMessage = {
      uId: this.user.me.uid,
      date: new Date(),
      content: this.messageForm.value,
      dId: this.discussionId,
      mId: Math.random().toString(),
    };
    this.messages.push(newMessage);
    this.messagingSvc
      .sendMessage(this.discussionId, this.messageForm.value)
      .then((mid) => {
        if (mid) {
          this.messages[this.messages.length - 1].mId = mid;
        }
      });
    this.messageForm.reset();
  }
}
