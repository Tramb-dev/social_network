import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { NewMessageResponseCallback } from "../interfaces/discussion";
import { Message, NewMessage } from "../interfaces/message";

import { UserService } from "./user.service";

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

  getNewMessages(): Observable<NewMessage> {
    return this.socket.fromEvent<NewMessage>("newMessage");
  }
}
