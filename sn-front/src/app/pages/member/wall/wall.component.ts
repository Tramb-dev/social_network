import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";

import { PostsService } from "src/app/services/posts.service";

import { Post } from "src/app/interfaces/post";

@Component({
  selector: "app-wall",
  templateUrl: "./wall.component.html",
  styleUrls: ["./wall.component.scss"],
})
export class WallComponent implements OnInit, OnDestroy {
  breadcrumbs: string = "Fil d'actualité";
  private postsSubscription: Subscription = Subscription.EMPTY;
  posts: Post[] = [];
  wallId: string | null = "";

  constructor(private postsSvc: PostsService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.wallId = this.route.snapshot.paramMap.get("wallId");
    this.wallPosts();
  }

  ngOnDestroy() {
    if (this.postsSubscription) {
      this.postsSubscription.unsubscribe();
    }
  }

  wallPosts() {
    this.postsSubscription = this.postsSvc.displayPosts().subscribe((posts) => {
      if (posts) {
        this.posts = posts;
      }
    });
  }
}
