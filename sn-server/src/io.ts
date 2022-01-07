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

  /**
   * Handle the connection of a user
   * @param socket
   * @returns this
   */
  private onConnection(
    socket: Socket<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents
    >
  ): SocketIO {
    console.log("a user connected");
    const token = socket.handshake.query.token;
    const verifiedToken = this.checkAuth(token);
    if (verifiedToken) {
      this.joinsRooms(verifiedToken, socket);
    } else {
      console.log("not auth");
    }
    return this;
  }

  /**
   * The socket controller where all the Client to Server event are controlled
   * @param uid The user id of this event
   * @param socket
   * @returns this
   */
  private socketCtrl(
    uid: string,
    socket: Socket<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents
    >
  ): SocketIO {
    socket.on("messageReceived", (content, dId, uid) =>
      this.onNewMessage(socket, content, dId, uid)
    );
    socket.on("joinRoom", (roomId) => this.joinRoom(uid, socket, roomId));
    socket.on("disconnect", () => this.onDisconnect(socket));
    return this;
  }

  /**
   * At the connection, the user joins all its discussions
   * @param token The user provided token
   * @param socket
   * @returns this
   */
  private joinsRooms(token: string | JwtPayload, socket: Socket): SocketIO {
    if (typeof token === "object" && token.uid) {
      const uid = token.uid;
      discussionsService.getAllRooms(uid).then((rooms) => {
        rooms.forEach((room) => {
          if (!socket.rooms.has(room)) {
            socket.join(room);
          }
        });
        this.socketCtrl(uid, socket);
      });
    }
    return this;
  }

  /**
   * When the user enter a room, check if it already exist or was created
   * @param uid The user id
   * @param socket
   * @param roomId the room id to check
   * @returns this
   */
  private joinRoom(
    uid: string,
    socket: Socket<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents
    >,
    roomId: string
  ): SocketIO {
    if (!socket.rooms.has(roomId)) {
      discussionsService.getAllRooms(uid).then((rooms) => {
        if (rooms.includes(roomId)) {
          socket.join(roomId);
          socket.emit("roomJoined", "OK");
        } else {
          socket.emit("roomJoined", "KOK");
        }
      });
    } else {
      socket.emit("roomJoined", "OK");
    }
    return this;
  }

  /**
   * When a user send a new message in a discussion
   * @param socket
   * @param content The content of the new message
   * @param dId The discussion id to post this message
   * @param uid The user id who send this message
   * @returns this
   */
  private onNewMessage(
    socket: Socket<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents
    >,
    content: string,
    dId: string,
    uid: string
  ): SocketIO {
    if (
      typeof dId === "string" &&
      typeof uid === "string" &&
      typeof content === "string"
    ) {
      discussionsService
        .addNewMessage(dId, uid, content)
        .then((message) => {
          if (message) {
            socket.broadcast.to(dId).emit("newMessage", message, uid);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
    return this;
  }

  private onDisconnect(
    socket: Socket<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents
    >
  ): SocketIO {
    userService.userDisconnect(socket.id);
    return this;
  }

  /**
   * Check if the user is authenticate through the provided token in socket query.
   * @param token
   * @returns false if not auth or the JwtPayload otherwise
   */
  private checkAuth(token: unknown): string | false | JwtPayload {
    if (typeof token === "string") {
      return authService.checkWebsocketAuth(token);
    }
    return false;
  }
}
