import { Router } from "express";
import {
  getUsers,
  createUser,
  login,
  userUpdate,
} from "../controllers/user.controller";
import { auth } from "../middleware/auth";

const router = Router();

router.get("/users", auth, getUsers);

router.post("/register", createUser);

router.post("/update", userUpdate);

router.post("/login", login);

export default router;
