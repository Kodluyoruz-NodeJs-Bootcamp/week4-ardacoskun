import { NextFunction, Request, Response } from "express";

export const authRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/");
  }

  next();
};
