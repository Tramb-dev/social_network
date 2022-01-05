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

export default router;
