import { Router } from "express";
import userRouter from "../controllers/user.controller";
import postsRouter from "../controllers/posts.controller";
import discussionsRouter from "../controllers/discussions.controller";
import path from "path";

const router = Router();
router.use("/user", userRouter);
router.use("/posts", postsRouter);
router.use("/discussions", discussionsRouter);
const ROOT = path.dirname(__dirname);
const publicPath = path.join(ROOT, "public");

router.get("*", (req, res, next) => {
  res.sendFile(path.normalize(publicPath + "/index.html"));
  next();
});

export default router;
