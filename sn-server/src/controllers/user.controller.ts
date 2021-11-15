import { Router } from "express";
import { UserService } from "../services/user/user.service";

const router = Router();
const userService = new UserService();

router.get("/", userService.helloWorld);
router.post("/sign-in", userService.signIn);
router.post("/sign-up", userService.signUp);
router.post("/forgot-password", userService.forgotPassword);
router.post("/reset-password-req", userService.resetPasswordExists);
router.post("/reset-password", userService.resetPassword);

export default router;
