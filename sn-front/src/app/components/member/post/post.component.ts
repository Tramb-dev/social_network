import { Component, Input } from "@angular/core";
import { Post } from "src/app/interfaces/post";
import { PostsService } from "src/app/services/posts.service";

@Component({
  selector: "app-post",
  templateUrl: "./post.component.html",
  styleUrls: ["./post.component.scss"],
})
export class PostComponent {
  @Input() post = {} as Post;

  constructor(private postsSvc: PostsService) {}

  deletePost() {
    this.postsSvc.deletePost(this.post.pid);
  }
}
