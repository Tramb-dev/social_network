import { Router } from "express";

const userRouter = Router();

userRouter.get("/", (req, res) => {
  res.send("hello user!");
});

export default userRouter;
