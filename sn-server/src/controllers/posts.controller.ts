import { Router } from "express";
import { postsService } from "../services/posts/posts.service";

const router = Router();

router.get("/all-wall-posts", postsService.sendAllWallPosts.bind(postsService));
router.put("/add-post", postsService.addPost.bind(postsService));
router.put("/add-comment", postsService.addComment.bind(postsService));
router.delete("/delete-post", postsService.deletePost.bind(postsService));

export default router;
