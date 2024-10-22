import express from "express";
import {
  adminLogin,
  adminLogout,
  resetAdminPin,
  verifyToken,
} from "../controllers/adminController";

const router = express.Router();

// ===================
// Admin Routes
// ===================

router.post("/auth/login", adminLogin);
router.post("/auth/logout", adminLogout);
router.get("/auth/verify-token", verifyToken);
router.put("/auth/reset-pin", resetAdminPin);

export default router;
