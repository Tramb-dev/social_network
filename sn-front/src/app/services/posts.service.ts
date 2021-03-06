import { Injectable } from "@angular/core";
import { ReplaySubject, Observable } from "rxjs";

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
   * Retrieves all posts for a given wall.
   * @param wallId
   * @returns this service
   */
  private allWallPosts(wallId: string): PostsService {
    this.http.getAllWallPosts(wallId).subscribe(this.updatePosts.bind(this));
    return this;
  }

  /**
   * Retrieves all post from user's friends.
   * @returns this service
   */
  private allFriendsPosts(): PostsService {
    this.http.getAllFriendsPosts().subscribe(this.updatePosts.bind(this));
    return this;
  }

  /**
   * Takes the data providen to update and send the posts
   * @param data an array of posts
   * @returns this service
   */
  private updatePosts(data: Post[]): PostsService {
    if (data) {
      this.posts = data;
      this.posts$.next(data);
    }
    return this;
  }

  /**
   * Send an observable with the posts requested
   * @param wallId The wall id requested. If not, request the posts from friends
   * @returns An observable with an array of posts
   */
  displayPosts(wallId?: string): Observable<Post[]> {
    if (wallId) {
      this.allWallPosts(wallId);
    } else {
      this.allFriendsPosts();
    }
    return this.posts$.asObservable();
  }

  /**
   * Send a new post message and add it to the array of posts to display
   * @param message the content of the message
   * @param wallId the wall id to post this emssage
   * @returns this service
   */
  sendMessage(message: string, wallId: string): PostsService {
    const uid = this.user.me.uid;
    this.http.sendProfileMessage(message, wallId, uid).subscribe((data) => {
      if (data) {
        this.posts.unshift(data);
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
    const uid = this.user.me.uid;
    this.http.sendComment(message, postId, uid).subscribe((data) => {
      if (data) {
        const updatedPost = data;
        const indexToReplace = this.findPost(updatedPost.pid);
        this.posts[indexToReplace] = updatedPost;
        this.posts$.next(this.posts);
      }
    });
    return this;
  }

  /**
   * Check if the user can access to post menu. The post must be on the user wall
   * or the user is its author
   * @param postUid the user id who has written this post
   * @param wallId the wall id where this post is
   * @returns true if the user can display the menu, false otherwise
   */
  canDisplayMenu(postUid: string, wallId: string): boolean {
    const uid = this.user.me.uid;
    if (postUid === uid || wallId === uid) {
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
