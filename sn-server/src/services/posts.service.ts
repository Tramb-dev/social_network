import { NextFunction, Request, Response } from "express";
import { db } from "./db/index.db";

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
    const context = res.locals.verifiedToken;
    if (typeof wallId === "string") {
      if (wallId === context.uid || this.isUserAFriend(wallId, context.uid)) {
        return db
          .getAllWallPosts(wallId)
          .then((posts) => {
            return res.json(posts);
          })
          .catch((err) => {
            res.status(500);
            return next(err);
          });
      }
      return res.sendStatus(401);
    }
    return res.sendStatus(400);
  }

  /**
   * Send the all the posts from the user's friend list
   * @param req
   * @param res
   * @param next
   * @returns An array of posts
   */
  sendAllFriendsPosts(req: Request, res: Response, next: NextFunction) {
    const context = res.locals.verifiedToken;
    return db
      .getAllFriendsPosts(context.uid)
      .then((posts) => {
        return res.json(posts);
      })
      .catch((err) => {
        res.status(500);
        return next(err);
      });
  }

  /**
   * Check if the current user is a friend of this wall owner
   * @param wallId the owner of this wall
   * @param uid the current user id
   * @returns true if it's a friend, false otherwise
   */
  private isUserAFriend(wallId: string, uid: string): Promise<boolean> {
    return db.user.getUser(uid).then((user) => {
      if (user?.friends?.includes(wallId)) {
        return true;
      }
      return false;
    });
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

  deletePost(req: Request, res: Response, next: NextFunction) {
    const pid = req.query.pid;
    const uid = res.locals.verifiedToken.uid;
    if (typeof pid === "string" && typeof uid === "string") {
      return db.posts
        .getPost(pid)
        .then((post) => {
          if (post && (post.wallId === uid || post.uid === uid)) {
            return db.posts
              .deletePost(pid)
              .then((isDeleted) => {
                if (isDeleted) {
                  return res.sendStatus(200);
                }
                return res.sendStatus(500);
              })
              .catch((err) => {
                res.status(500);
                return next(err);
              });
          }
          res.status(403);
          return next(new Error("Your are not allowed to delete this post."));
        })
        .catch((err) => {
          res.status(404);
          return next(err);
        });
    }
    return res.sendStatus(400);
  }
}

export const postsService = new PostsService();
