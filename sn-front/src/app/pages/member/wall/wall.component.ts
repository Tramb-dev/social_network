import { Component, OnDestroy, OnInit } from "@angular/core";
import { combineLatest, map, merge, Observable, Subscription } from "rxjs";
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
  ) {}

  ngOnInit(): void {
    this.wallSubscription = combineLatest([
      this.route.url,
      this.route.paramMap,
    ]).subscribe(([url, params]) => {
      if (url[0].path === "feed") {
        this.wallPosts();
      } else {
        this.wallId = params.get("wallId");
        if (this.wallId === this.user.me.uid) {
          this.breadcrumbs = "Mon fil d'actualité";
          this.title.setTitle("Mon mur - " + siteName);
        } else {
          if (this.wallId) {
            this.user.getUser(this.wallId).subscribe((user) => {
              this.breadcrumbs = `Fil de ${user.firstName}`;
              this.title.setTitle(
                `Mur de ${user.firstName} ${user.lastName} - ${siteName}`
              );
            });
          }
        }
        this.wallPosts(this.wallId);
      }
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

  private wallPosts(wallId?: string | null): WallComponent {
    let displayPost$: Observable<Post[]>;
    if (wallId) {
      displayPost$ = this.postsSvc.displayPosts(wallId);
    } else {
      displayPost$ = this.postsSvc.displayPosts();
    }
    this.postsSubscription = displayPost$.subscribe((posts) => {
      if (posts) {
        this.posts = posts;
      }
    });
    return this;
  }
}
