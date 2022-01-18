import { Injectable } from "@angular/core";
import {
  combineLatest,
  filter,
  map,
  Observable,
  ReplaySubject,
  tap,
} from "rxjs";

import { WebsocketsService } from "./websockets.service";
import { UserService } from "./user.service";
import { HttpService } from "./http.service";

import { Discussion } from "../interfaces/discussion";
import { NewMessage } from "../interfaces/message";
import { RandomUser } from "../interfaces/user";

@Injectable({
  providedIn: "root",
})
export class MessagingService {
  private discussions: Discussion[] = [];
  private discussions$ = new ReplaySubject<Discussion[]>(1);

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
  getDiscussion(dId: string): Observable<Discussion> {
    return this.httpSvc.getThisDiscussion(dId).pipe(
      tap((discussion) => {
        const index = this.discussions.findIndex(
          (element) => element.dId === discussion.dId
        );
        if (index > -1) {
          this.discussions[index] = discussion;
        } else {
          this.discussions.push(discussion);
        }
      })
    );
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
    combineLatest<[Discussion[], RandomUser[]]>([
      this.httpSvc.getAllUserDiscussions(uid),
      this.user.displayFriends(),
    ])
      .pipe(
        map(([discussions, friends]) => {
          return discussions.map((discussion) => {
            discussion.users.forEach((user) => {
              if (user !== this.user.me.uid) {
                const currentFriend = friends.find(
                  (friend) => friend.uid === user
                );
                if (currentFriend) {
                  const name = `${currentFriend.firstName} ${currentFriend.lastName}`;
                  if (!discussion.authors) {
                    discussion.authors = [];
                  }
                  discussion.authors.push(name);
                }
              }
            });
            return discussion;
          });
        })
      )
      .subscribe((discussions) => {
        this.discussions = discussions;
        this.discussions$.next(discussions);
      });
    return this.discussions$.asObservable();
  }

  /**
   * Send a message for a discussion
   * @param dId the discussion to send this message
   * @param content the content of the message
   */
  sendMessage(dId: string, content: string): Promise<string | null> {
    return this.socket.sendMessage(dId, content).then((response) => {
      if (response.status === "ok" && response.mid) {
        return response.mid;
      }
      return null;
    });
  }

  /**
   * Get new messages from websockets
   * @param dId The discussion to observe
   * @returns The new message
   */
  getMessages(dId: string): Observable<NewMessage> {
    const newMessages$ = this.socket.getNewMessages().pipe(
      filter<NewMessage>((newMessage) => newMessage.dId === dId),
      tap((newMessage) => {
        const dId = newMessage.dId;
        const discussionIndex = this.discussions.findIndex(
          (element) => element.dId === dId
        );
        if (discussionIndex >= 0) {
          this.discussions[discussionIndex].messages.push(newMessage.message);
        }
      })
    );

    const deletedMessages$ = this.socket.deletedMessage().pipe(
      tap((result) => {
        const discussionIndex = this.discussions.findIndex(
          (element) => element.dId === result.dId
        );
        if (discussionIndex >= 0) {
          const messageIndex = this.discussions[
            discussionIndex
          ].messages.findIndex((element) => element.mid === result.mid);
          if (messageIndex >= 0) {
            this.discussions[discussionIndex].messages[messageIndex].deleted =
              true;
            this.discussions$.next(this.discussions);
          }
        }
      })
    );

    return combineLatest([newMessages$, deletedMessages$]).pipe(
      map((combineArray) => combineArray[0])
    );
  }

  /**
   * Delete a message in a discussion
   * @param mid The message id to delete
   * @returns True if deleted, false otherwise
   */
  deleteMessage(mid: string, dId: string) {
    this.socket.deleteMessage(mid, dId);
  }
}
