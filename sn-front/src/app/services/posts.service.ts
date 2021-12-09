import { Injectable } from "@angular/core";
import { ReplaySubject, map, Observable } from "rxjs";

import { HttpService } from "./http.service";
import { UserService } from "./user.service";

import { Post } from "../interfaces/post";

@Injectable({
  providedIn: "root",
})
export class PostsService {
  private posts: Post[] = [];
  private posts$ = new ReplaySubject<Post[]>(1);
  constructor(private http: HttpService, private user: UserService) {}

  /**
   * Retrieves all posts for a given wall. If not provided, get the wall corresponding
   * to this user.
   * @param wallId
   * @returns A promise with all retrieved posts or null
   */
  private allWallPosts(wallId: string): PostsService {
    this.http.getAllWallPosts(wallId).subscribe((data) => {
      if (data && data.body) {
        this.posts = data.body;
        this.posts$.next(data.body);
      }
    });
    return this;
  }

  displayPosts(wallId?: string): Observable<Post[]> {
    if (!wallId) {
      wallId = this.user.getUser().uid;
    }
    this.allWallPosts(wallId);
    return this.posts$.asObservable();
  }

  sendMessage(message: string, wallId: string): PostsService {
    const uid = this.user.getUser().uid;
    this.http.sendProfileMessage(message, wallId, uid).subscribe((data) => {
      if (data && data.body) {
        this.posts.unshift(data.body);
        this.posts$.next(this.posts);
      }
    });
    return this;
  }

  sendReply(message: string, postId: string): PostsService {
    const uid = this.user.getUser().uid;
    this.http.sendComment(message, postId, uid).subscribe((data) => {
      if (data && data.body) {
      }
    });
    return this;
  }
}
