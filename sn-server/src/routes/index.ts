import { Router } from "express";
import userRouter from "../controllers/user.controller";
import postsRouter from "../controllers/posts.controller";
import discussionsRouter from "../controllers/discussions.controller";

const router = Router();
router.use("/user", userRouter);
router.use("/posts", postsRouter);
router.use("/discussions", discussionsRouter);

export default router;
