import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
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

import { Message } from "src/app/interfaces/message";

registerLocaleData(localeFr, "fr");

@Component({
  selector: "app-discussion",
  templateUrl: "./discussion.component.html",
  styleUrls: ["./discussion.component.scss"],
})
export class DiscussionComponent
  implements OnInit, OnDestroy, AfterViewChecked
{
  me = this.user.me.uid;
  messageForm = new FormControl("");
  messages: Message[] = [];
  private discussionId: string = "";
  private discussion$ = Subscription.EMPTY;
  @ViewChild("scroll") private scrollContainer?: ElementRef;

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
                map((discussion) => discussion.messages),
                tap((messages) => (this.messages = messages))
              );
            const newMessage$ = this.messagingSvc
              .getMessages(discussionId)
              .pipe(
                map((newMessage) => {
                  if (newMessage.dId === discussionId) {
                    this.messages.push(newMessage.message);
                  }
                  return this.messages;
                })
              );
            return concat(discussion$, newMessage$);
          }
          return of(null);
        })
      )
      .subscribe();
  }

  ngAfterViewChecked(): void {
    if (this.scrollContainer) {
      this.scrollToBottom(this.scrollContainer);
    }
  }

  ngOnDestroy(): void {
    if (this.discussion$) {
      this.discussion$.unsubscribe();
    }
  }

  publish(): DiscussionComponent {
    const newMessage = {
      uid: this.user.me.uid,
      date: new Date(),
      content: this.messageForm.value,
      mid: Math.random().toString(),
      author: `${this.user.me.firstName} ${this.user.me.lastName}`,
    };
    this.messages.push(newMessage);
    this.messagingSvc
      .sendMessage(this.discussionId, this.messageForm.value)
      .then((mid) => {
        if (mid) {
          this.messages[this.messages.length - 1].mid = mid;
        }
      });
    this.messageForm.reset();
    return this;
  }

  handleKeyUp(event: KeyboardEvent): DiscussionComponent {
    if ("Enter" === event.key && !event.shiftKey) {
      this.publish();
    }
    return this;
  }

  deleteMessage(mid: string) {
    this.messagingSvc.deleteMessage(mid, this.discussionId);
  }

  private scrollToBottom(el: ElementRef): DiscussionComponent {
    el.nativeElement.scroll({
      top: el.nativeElement.scrollHeight,
      left: 0,
      behavior: "smooth",
    });
    return this;
  }
}
