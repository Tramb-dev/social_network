import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";

import { HttpService } from "./http.service";
import { UserService } from "./user.service";

import { Post } from "../interfaces/post";

@Injectable({
  providedIn: "root",
})
export class PostsService {
  constructor(private http: HttpService, private user: UserService) {}

  allWallPosts(wallId?: string): Observable<Post[] | null> {
    if (!wallId) {
      wallId = this.user.getUser().uid;
    }
    return this.http.getAllWallPosts(wallId).pipe(
      map((data) => {
        if (data) {
          return data.body;
        }
        return null;
      })
    );
  }
}
