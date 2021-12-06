import { Router } from "express";
import { postsService } from "../services/posts/posts.service";

const router = Router();

router.get("/all-wall-posts", postsService.sendAllWallPosts.bind(postsService));

export default router;
