import { NextFunction, Request, Response } from "express";
import { db } from "../db/index.db";

class PostsService {
  /**
   * Retrieves all the posts (limited to last 10 for the moment) from a wall
   * @param req Must contain the wallId
   * @param res
   * @param next
   * @returns An array of posts
   */
  sendAllWallPosts(req: Request, res: Response, next: NextFunction) {
    const wallId = req.query.wallId;
    if (typeof wallId === "string") {
      return db
        .getAllWallPosts(wallId)
        .then((posts) => {
          return res.json(posts);
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

  /**
   * Add a post to a given wall
   * @param req Must contain wallId, uid (user id, who write this post) and content
   * @param res
   * @param next
   * @returns The added post
   */
  addPost(req: Request, res: Response, next: NextFunction) {
    const wallId = req.body.wallId;
    const uid = req.body.uid;
    const content = req.body.content;
    if (
      typeof wallId === "string" &&
      typeof uid === "string" &&
      typeof content === "string"
    ) {
      return db
        .addPost(wallId, uid, content)
        .then((post) => {
          if (post) {
            return res.json(post);
          }
          return res.sendStatus(404);
        })
        .catch((err) => {
          res.status(500);
          return next(
            new Error("Adding a new post was not successful: " + err)
          );
        });
    }
    return res.sendStatus(400);
  }

  /**
   * Add a comment to a post and return this post
   * @param req Must contain pid (post id), uid (user id, who write this comment)
   * and content
   * @param res
   * @param next
   * @returns The post where the comment has been added
   */
  addComment(req: Request, res: Response, next: NextFunction) {
    const pid = req.body.pid;
    const uid = req.body.uid;
    const content = req.body.content;
    if (
      typeof pid === "string" &&
      typeof uid === "string" &&
      typeof content === "string"
    ) {
      return db
        .addComent(pid, uid, content)
        .then((post) => {
          if (post) {
            return res.json(post);
          }
          return res.sendStatus(404);
        })
        .catch((err) => {
          res.status(500);
          return next(
            new Error("Adding a new comment was not successful: " + err)
          );
        });
    }
    return res.sendStatus(400);
  }
}

export const postsService = new PostsService();
