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
   * @returns this service
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

  /**
   * Send an observable with the posts requested
   * @param wallId
   * @returns An observable with an array of posts
   */
  displayPosts(wallId?: string): Observable<Post[]> {
    if (!wallId) {
      wallId = this.user.getUser().uid;
    }
    this.allWallPosts(wallId);
    return this.posts$.asObservable();
  }

  /**
   * Send a new post message and add it to the array of posts to display
   * @param message the content of the message
   * @param wallId the wall id to post this emssage
   * @returns this service
   */
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

  /**
   * Send a comment to a post, and get this updated post to update the view
   * with the observable
   * @param message the content of the comment
   * @param postId the post id to update
   * @returns this service
   */
  sendReply(message: string, postId: string): PostsService {
    const uid = this.user.getUser().uid;
    this.http.sendComment(message, postId, uid).subscribe((data) => {
      if (data && data.body) {
        const updatedPost = data.body;
        const indexToReplace = this.findPost(updatedPost.pid);
        this.posts[indexToReplace] = updatedPost;
        this.posts$.next(this.posts);
      }
    });
    return this;
  }

  canDisplayMenu(pid: string, wallId: string): boolean {
    const uid = this.user.getUser().uid;
    if (pid === uid || wallId === uid) {
      return true;
    }
    return false;
  }

  /**
   * Delete a post
   * @param pid the post id to delete
   */
  deletePost(pid: string): PostsService {
    this.http.deletePost(pid).subscribe((response) => {
      if (response === "OK") {
        const indexToDelete = this.findPost(pid);
        this.posts.splice(indexToDelete, 1);
        this.posts$.next(this.posts);
      }
    });
    return this;
  }

  /**
   * Find a post in the post array
   * @param postToFind the pid of the post to find
   * @returns the index of this post in the posts array
   */
  private findPost(postToFind: string): number {
    return this.posts.findIndex((element) => element.pid === postToFind);
  }
}
