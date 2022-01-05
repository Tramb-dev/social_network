import { Router } from "express";
import userRouter from "../controllers/user.controller";
import postsRouter from "../controllers/posts.controller";
import discussionsRouter from "../controllers/discussions.controller";

const router = Router();
router.use("/user", userRouter);
router.use("/posts", postsRouter);
router.use("/discussions", discussionsRouter);

router.get("*", (req, res, next) => {
  console.log("Request was made to: " + req.originalUrl);
  return next();
});

router.get("*", (req, res, next) => {
  const err = new Error("Page doesn't exists");
  res.status(404);
  next(err);
});

export default router;
