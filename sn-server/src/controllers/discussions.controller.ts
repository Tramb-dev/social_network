import { Router } from "express";
import { authService } from "../services/auth/auth.service";
import { discussionsService } from "../services/discussions.service";

const router = Router();

router
  .route("/private-discussion")
  .get(
    authService.checkIfAuthenticated.bind(authService),
    discussionsService.getPrivateDiscussion.bind(discussionsService)
  );
router
  .route("/discussion")
  .get(
    authService.checkIfAuthenticated.bind(authService),
    discussionsService.getThisDiscussion.bind(discussionsService)
  );
router
  .route("/all-discussions")
  .get(
    authService.checkIfAuthenticated.bind(authService),
    discussionsService.getAllDiscussions.bind(discussionsService)
  );

export default router;
