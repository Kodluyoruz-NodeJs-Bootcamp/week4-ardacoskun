import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getRepository } from "typeorm";
import { User } from "../entity/User";

//Declare user type to User model when we use it with request.
declare global {
  namespace Express {
    export interface Request {
      user: User;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const userAgent = req.headers["user-agent"] as string;

  try {
    //Decoding JWT
    const token: string = await req.cookies.jwt;

    let decoded = jwt.verify(token, "secretkey") as JwtPayload;

    //Compare id from token and userId from session if they are not match we throw an error
    if (decoded.id !== req.session.userId) {
      throw new Error("Authentication Error");
    }
    //compare browser infos
    else if (
      decoded.userAgent !== req.session.userAgent ||
      decoded.userAgent !== userAgent
    ) {
      throw new Error("You can not use a diffrent browser.");
    }
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ id: decoded.id });

    //Checking for if user exist
    if (!user) {
      throw new Error("User is not found");
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(500).redirect("/login");
  }
};
