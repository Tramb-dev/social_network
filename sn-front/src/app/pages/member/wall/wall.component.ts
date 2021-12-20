import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";

import { PostsService } from "src/app/services/posts.service";
import { UserService } from "src/app/services/user.service";

import { Post } from "src/app/interfaces/post";
import { siteName } from "src/global-variable";

@Component({
  selector: "app-wall",
  templateUrl: "./wall.component.html",
  styleUrls: ["./wall.component.scss"],
})
export class WallComponent implements OnInit, OnDestroy {
  breadcrumbs: string = "Fil d'actualité";
  private postsSubscription: Subscription = Subscription.EMPTY;
  private wallSubscription: Subscription = Subscription.EMPTY;
  posts: Post[] = [];
  wallId: string | null = "";

  constructor(
    private postsSvc: PostsService,
    private route: ActivatedRoute,
    private title: Title,
    private user: UserService
  ) {
    title.setTitle("Mon mur - " + siteName);
  }

  ngOnInit(): void {
    this.wallSubscription = this.route.paramMap.subscribe((params) => {
      this.wallId = this.route.snapshot.paramMap.get("wallId");
      if (this.wallId === this.user.me.uid) {
        this.breadcrumbs = "Mon fil d'actualité";
      } else {
        if (this.wallId) {
          this.user.getUser(this.wallId).subscribe((user) => {
            this.breadcrumbs = `Fil de ${user.firstName}`;
          });
        }
      }
      this.wallPosts();
    });
  }

  ngOnDestroy() {
    if (this.postsSubscription) {
      this.postsSubscription.unsubscribe();
    }
    if (this.wallSubscription) {
      this.wallSubscription.unsubscribe();
    }
  }

  private wallPosts() {
    let displayPost$: Observable<Post[]>;
    if (this.wallId) {
      displayPost$ = this.postsSvc.displayPosts(this.wallId);
    } else {
      displayPost$ = this.postsSvc.displayPosts();
    }
    this.postsSubscription = displayPost$.subscribe((posts) => {
      if (posts) {
        this.posts = posts;
      }
    });
  }
}
