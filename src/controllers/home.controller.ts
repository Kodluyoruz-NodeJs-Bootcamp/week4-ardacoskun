import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";

//Render register page
export const getRegister = (req: Request, res: Response) => {
  res.render("register");
};

//Render login page
export const getLogin = (req: Request, res: Response) => {
  res.render("login");
};

//Render home page
export const getDashboard = async (req: Request, res: Response) => {
  try {
    const users = await getRepository(User).find();

    res.render("dashboard", { users });
  } catch (error) {
    res.render("dashboard", {
      error,
    });
  }
};

//Render profile page
export const getProfile = async (req: Request, res: Response) => {
  try {
    //Find current user with user id
    const user = await getRepository(User).findOne({ id: req.session.userId });

    if (!user) {
      throw new Error("Can not see the profile ");
    }

    res.render("profile", { user });
  } catch (error) {
    res.render("profile", { error });
  }
};
