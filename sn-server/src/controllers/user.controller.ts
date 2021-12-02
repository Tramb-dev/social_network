import { Router } from "express";
import { userService } from "../services/user/user.service";

const router = Router();

router.get("/reconnect", userService.autoConnect.bind(userService));
router.get("/sign-in", userService.signIn.bind(userService));
router.post("/sign-up", userService.signUp.bind(userService));
router.get("/forgot-password", userService.forgotPassword.bind(userService));
router.get(
  "/reset-password-req",
  userService.resetPasswordExists.bind(userService)
);
router.post("/reset-password", userService.resetPassword.bind(userService));

export default router;
