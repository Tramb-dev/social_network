import { Socket, Server } from "socket.io";
import http from "http";
import { JwtPayload } from "jsonwebtoken";
import { authService } from "./services/auth/auth.service";
import { discussionsService } from "./services/discussions.service";

import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
} from "./interfaces/socketIO.interface";
import { userService } from "./services/user.service";

export class SocketIO {
  private io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents
  >(this.server, {
    cors: this.corsOptions,
  });

  constructor(
    private server: http.Server,
    private corsOptions: Record<string, unknown>
  ) {
    this.io.on("connection", this.onConnection.bind(this));
  }

  private onConnection(
    socket: Socket<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents
    >
  ) {
    console.log("a user connected");
    const token = socket.handshake.query.token;
    const verifiedToken = this.checkAuth(token);
    if (verifiedToken) {
      this.joinsRooms(verifiedToken, socket);
    } else {
      console.log("not auth");
    }
  }

  private socketCtrl(
    socket: Socket<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents
    >
  ) {
    socket.on("newMessage", this.onNewMessage.bind(this));
    socket.on("disconnect", () => this.onDisconnect(socket));
  }

  private joinsRooms(token: string | JwtPayload, socket: Socket) {
    if (typeof token === "object" && token.uid) {
      const uid = token.uid;
      discussionsService.getAllRooms(uid).then((rooms) => {
        rooms.forEach((room) => {
          socket.join(room);
        });
        this.socketCtrl(socket);
      });
    }
  }

  private onNewMessage(content: string, dId: string, uid: string) {
    console.log(content, dId, uid);
    if (
      typeof dId === "string" &&
      typeof uid === "string" &&
      typeof content === "string"
    ) {
      discussionsService
        .addNewMessage(dId, uid, content)
        .then((message) => {
          if (message) {
            this.io.emit("newMessage", message, uid);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  private onDisconnect(
    socket: Socket<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents
    >
  ) {
    userService.userDisconnect(socket.id);
  }

  private checkAuth(token: unknown): string | false | JwtPayload {
    if (typeof token === "string") {
      return authService.checkWebsocketAuth(token);
    }
    return false;
  }
}
