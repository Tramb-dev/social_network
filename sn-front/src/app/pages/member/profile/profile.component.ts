import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { PostsService } from "src/app/services/posts.service";

import { Post } from "src/app/interfaces/post";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit, OnDestroy {
  breadcrumbs: string = "Fil d'actualité";
  private postsSubscription: Subscription = Subscription.EMPTY;
  posts: Post[] = [];

  constructor(private postsSvc: PostsService) {}

  ngOnInit() {
    this.wallPosts();
  }

  ngOnDestroy() {
    if (this.postsSubscription) {
      this.postsSubscription.unsubscribe();
    }
  }

  wallPosts() {
    this.postsSubscription = this.postsSvc.allWallPosts().subscribe((posts) => {
      if (posts) {
        this.posts = posts;
      }
    });
  }
}
