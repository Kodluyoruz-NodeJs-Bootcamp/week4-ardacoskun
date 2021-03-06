import { Router } from "express";
import {
  getUsers,
  createUser,
  login,
  userUpdate,
  upload,
  deleteUser,
} from "../controllers/user.controller";
import { auth } from "../middleware/auth";

const router = Router();

router.get("/users", auth, getUsers);

router.post("/register", createUser);

router.post("/update", upload.single("avatar"), userUpdate);

router.post("/login", login);

router.get("/delete", auth, deleteUser);

export default router;
