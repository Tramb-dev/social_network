import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { WebsocketsService } from "./websockets.service";
import { UserService } from "./user.service";
import { HttpService } from "./http.service";

import { Discussion } from "../interfaces/discussion";
import { Message } from "../interfaces/message";

@Injectable({
  providedIn: "root",
})
export class MessagingService {
  constructor(
    private socket: WebsocketsService,
    private user: UserService,
    private httpSvc: HttpService
  ) {}

  /**
   * Get all the messages for a given discussion
   * @param dId the discussion id
   * @returns an array of messages
   */
  getMessages(dId: string): Observable<Discussion> {
    return this.httpSvc.getThisDiscussion(dId);
  }

  /**
   * Get all the messages for a private discussion.
   * Used when this is a discussion with only two users.
   * @param dId the discussion id
   * @returns the discussion
   */
  getPrivateMessages(friendUid: string, uid?: string): Observable<Discussion> {
    if (!uid) {
      uid = this.user.me.uid;
    }
    return this.httpSvc.getPrivateDiscussion(uid, friendUid);
  }

  /**
   * Get all the discussions for a user
   * @param uid Optional: the current user if omitted, the given user otherwise
   * @returns an array of discussions
   */
  getDiscussions(uid?: string): Observable<Discussion[]> {
    if (!uid) {
      uid = this.user.me.uid;
    }
    return this.httpSvc.getAllUserDiscussions(uid);
  }

  /**
   * Send a message for a discussion
   * @param dId the discussion to send this message
   * @param content the content of the message
   */
  sendMessage(dId: string, content: string) {
    this.socket.sendMessage(content);
  }
}
