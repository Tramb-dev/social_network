import { Socket, Server } from "socket.io";
import http from "http";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
} from "./interfaces/socketIO.interface";
import { authService } from "./services/auth/auth.service";
import { JwtPayload } from "jsonwebtoken";

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

  private onConnection(socket: Socket) {
    console.log("a user connected");
    const token = socket.handshake.query.token;
    const verifiedToken = this.checkAuth(token);
    if (verifiedToken) {
      this.socketCtrl(socket);
    }
  }

  private socketCtrl(socket: Socket) {
    socket.on("newMessage", (msg) => this.onNewMessage(msg));
    socket.on("disconnect", () => this.onDeconnection(socket));
  }

  private onNewMessage(msg: string) {
    console.log("message : " + msg);
    this.io.emit("test", "string");
  }

  private onDeconnection(socket: Socket) {
    console.log("a user disconnected");
  }

  private checkAuth(token: unknown): string | false | JwtPayload {
    if (typeof token === "string") {
      return authService.checkWebsocketAuth(token);
    }
    return false;
  }
}
