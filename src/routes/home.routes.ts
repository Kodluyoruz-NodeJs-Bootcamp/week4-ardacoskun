import { Router } from "express";
import {
  getRegister,
  getLogin,
  getDashboard,
  getProfile,
  getUpdate,
} from "../controllers/home.controller";
import { auth } from "../middleware/auth";
import { logout } from "../controllers/user.controller";

import { authRoute } from "../middleware/authRouıte";

const router = Router();

//Get Register Page
router.get("/register", authRoute, getRegister);

//Get Login Page
router.get("/login", authRoute, getLogin);

//Get Home Page
router.get("/", auth, getDashboard);

//Get Profile Page
router.get("/profile", auth, getProfile);

//Get Profile Update Page
router.get("/update", auth, getUpdate);

//Get Logout
router.get("/logout", auth, logout);

export default router;
