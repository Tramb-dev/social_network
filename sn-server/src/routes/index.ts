import { Router } from "express";
import userRouter from "../controllers/user.controller";

const router = Router();
router.use("/user", userRouter);

router.get("*", (req, res, next) => {
  console.log("Request was made to: " + req.originalUrl);
  return next();
});

router.get("/", (req, res) => {
  res.send("Hello world!");
});

router.get("*", (req, res, next) => {
  const err = new Error("Page doesn't exists");
  res.status(404);
  next(err);
});

export default router;
