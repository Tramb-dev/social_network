import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { Observable } from "rxjs";

import { UserService } from "./user.service";

import { NewMessage } from "../interfaces/message";
import {
  DeletedMessage,
  NewMessageResponseCallback,
} from "../interfaces/discussion";

@Injectable({
  providedIn: "root",
})
export class WebsocketsService {
  constructor(private socket: Socket, private user: UserService) {
    this.socket.ioSocket.io.opts.query = {
      token: user.me.token,
    };
    this.socket.connect();
  }

  /**
   * Send a new message in a discussion
   * @param discussionId The discussion where the message will be saved
   * @param message The message content
   * @param uid The user id who wrote this message
   * @returns The callback to know if the message has been served and stored in backend
   */
  sendMessage(
    discussionId: string,
    message: string,
    uid?: string
  ): Promise<NewMessageResponseCallback> {
    if (!uid) {
      uid = this.user.me.uid;
    }
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject("No socket connection");
      } else {
        this.socket.emit(
          "messageReceived",
          message,
          discussionId,
          uid,
          (response: NewMessageResponseCallback) => resolve(response)
        );
      }
    });
  }

  /**
   * Listener of new messages for any discussion
   * @returns The new message
   */
  getNewMessages(): Observable<NewMessage> {
    return this.socket.fromEvent<NewMessage>("newMessage");
  }

  /**
   * Delete a message in a discussion
   * @param mid The message id to delete
   * @param dId The discussion id where the message belong
   * @returns this
   */
  deleteMessage(mid: string, dId: string): WebsocketsService {
    this.socket.emit("deleteMessage", mid, dId);
    return this;
  }

  deletedMessage(): Observable<DeletedMessage> {
    return this.socket.fromEvent<DeletedMessage>("deletedMessage");
  }
}
