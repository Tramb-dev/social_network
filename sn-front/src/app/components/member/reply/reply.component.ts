import { Component, Input, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";

import { PostsService } from "src/app/services/posts.service";

import { PostRole } from "src/app/interfaces/post";

@Component({
  selector: "app-reply",
  templateUrl: "./reply.component.html",
  styleUrls: ["./reply.component.scss"],
})
export class ReplyComponent implements OnInit {
  @Input() role: string = "";
  @Input() id: string | null = "";
  message = new FormControl("", Validators.minLength(2));
  icon: string = "";

  constructor(private postSvc: PostsService) {}

  ngOnInit() {
    this.icon = this.role === PostRole.POST_MESSAGE ? "send" : "reply";
  }

  publish() {
    if (this.message.invalid || this.message.value < 2 || !this.id) {
      return;
    }

    switch (this.role) {
      case PostRole.POST_MESSAGE:
        this.postSvc.sendMessage(this.message.value, this.id);
        this.message.setValue("");
        break;

      case PostRole.REPLY:
        this.postSvc.sendReply(this.message.value, this.id);
        this.message.setValue("");
        break;

      default:
        break;
    }
  }
}
