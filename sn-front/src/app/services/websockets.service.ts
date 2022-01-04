import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

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

  sendMessage(message: string) {
    this.socket.emit("newMessage", message);
  }
}
