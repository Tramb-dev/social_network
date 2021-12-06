import { NextFunction, Request, Response } from "express";
import { Post } from "../../interfaces/post.interface";
import { db } from "../db/index.db";

class PostsService {
  sendAllWallPosts(req: Request, res: Response, next: NextFunction) {
    const wallId = req.query.wallId;
    if (typeof wallId === "string") {
      const promises: Promise<Post>[] = [];
      return db.posts
        .getAllWallPosts(wallId)
        .then((posts) => {
          posts.forEach((post) => {
            promises.push(
              db.user.getProfilPicture(post.uid).then((picture) => {
                if (picture) {
                  post.picture = picture;
                }
                return post;
              })
            );
          });

          return Promise.all(promises)
            .then((posts) => {
              return res.json(posts);
            })
            .catch((err) => {
              res.status(500);
              return next(
                new Error("Error in getting authors pictures " + err)
              );
            });
        })
        .catch((err) => {
          res.status(500);
          return next(
            new Error(
              "Error in getting all wall posts of wallID " + wallId + " " + err
            )
          );
        });
    }
    return res.sendStatus(400);
  }
}

export const postsService = new PostsService();
