import { Router } from "express";
import { userService } from "../services/user.service";

const router = Router();

router.route("/reconnect").get(userService.autoConnect.bind(userService));
router.route("/sign-in").get(userService.signIn.bind(userService));
router.route("/sign-up").put(userService.signUp.bind(userService));
router
  .route("/forgot-password")
  .get(userService.forgotPassword.bind(userService));
router
  .route("/reset-password-req")
  .get(userService.resetPasswordExists.bind(userService));
router
  .route("/reset-password")
  .post(userService.resetPassword.bind(userService));

export default router;
