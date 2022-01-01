import { Router } from "express";
import { userService } from "../services/user.service";
import { authService } from "../services/auth/auth.service";

const router = Router();

router
  .route("/reconnect")
  .get(
    authService.checkIfAuthenticated.bind(authService),
    userService.autoConnect.bind(userService)
  );
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
router
  .route("/get-user")
  .get(
    authService.checkIfAuthenticated.bind(authService),
    userService.getUser.bind(userService)
  );
router
  .route("/get-users")
  .get(
    authService.checkIfAuthenticated.bind(authService),
    userService.getAllUsers.bind(userService)
  );
router
  .route("/add-friend-request")
  .patch(
    authService.checkIfAuthenticated.bind(authService),
    userService.addFriendRequest.bind(userService)
  );
router
  .route("/accept-invitation")
  .patch(
    authService.checkIfAuthenticated.bind(authService),
    userService.acceptFriendRequest.bind(userService)
  );
router
  .route("/get-friends")
  .get(
    authService.checkIfAuthenticated.bind(authService),
    userService.getAllFriends.bind(userService)
  );
router
  .route("/recommend-friend")
  .post(
    authService.checkIfAuthenticated.bind(authService),
    userService.recommendFriend.bind(userService)
  );
router
  .route("/remove-friend")
  .patch(
    authService.checkIfAuthenticated.bind(authService),
    userService.removeFriend.bind(userService)
  );

export default router;
