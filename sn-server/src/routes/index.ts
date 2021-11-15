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

export default router;
