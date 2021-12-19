import { Router } from "express";
import { postsService } from "../services/posts.service";
import { authService } from "../services/auth/auth.service";

const router = Router();

router
  .route("/all-wall-posts")
  .get(
    authService.checkIfAuthenticated.bind(authService),
    postsService.sendAllWallPosts.bind(postsService)
  );
router
  .route("/add-post")
  .post(
    authService.checkIfAuthenticated.bind(authService),
    postsService.addPost.bind(postsService)
  );
router
  .route("/add-comment")
  .patch(
    authService.checkIfAuthenticated.bind(authService),
    postsService.addComment.bind(postsService)
  );
router
  .route("/delete-post")
  .delete(
    authService.checkIfAuthenticated.bind(authService),
    postsService.deletePost.bind(postsService)
  );

export default router;
