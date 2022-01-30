import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import bcrypt, { hash } from "bcrypt";

//Get All users function.It uses at home page.
export const getUsers = async (req: Request, res: Response) => {
  const users = await getRepository(User).find();
  return res.json(users);
};

//Create new User
export const createUser = async (req: Request, res: Response) => {
  let { firstName, lastName, userName, password } = req.body;
  let user = new User();

  user.firstName = firstName;
  user.lastName = lastName;
  user.userName = userName;
  user.password = password;

  try {
    //Call password hashing function from User model.
    await user.hashPassword();

    //Define database model and save user informations to db.
    const userRepository = getRepository(User);
    await userRepository.save(user);

    return res.status(200).redirect("/");
  } catch (error) {
    return res.render("register", {
      error,
    });
  }
};

//User profile update
export const userUpdate = async (req: Request, res: Response) => {
  const id = req.session.userId;

  const { firstName, lastName, password, userName } = req.body;

  const hashedPassword = await bcrypt.hash(password, 8);

  try {
    const userRepository = getRepository(User);
    const updatedUser = await userRepository.update(id, {
      firstName,
      lastName,
      userName,
      password: hashedPassword,
    });
    res.redirect("/profile");
  } catch (error: any) {
    if (error.message.includes("R_DUP_ENTRY: Duplicate entry")) {
      return res.render("update", { error: "Username already be taken! " });
    } else {
      return res.render("update", { error });
    }
  }
};

//User Login
export const login = async (req: Request, res: Response) => {
  const { userName, password } = req.body;

  //Get current browser info
  const userAgent = req.headers["user-agent"] as string;

  let user = new User();

  try {
    //Call login and create token functions from User model
    const loggedIn = await user.findByCredentials(userName, password);
    const token = await loggedIn.generateAuthToken(userAgent);

    //send cookie
    res.cookie("jwt", token, {
      maxAge: 3 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    //Create session properties
    req.session.userId = loggedIn.id;
    req.session.userAgent = userAgent;
    req.session.isLoggedIn = true;

    return res.status(200).redirect("/");
  } catch (error) {
    return res.render("login", {
      error,
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  //Cleaning cookies
  res.cookie("jwt", "", { maxAge: 1 });
  res.cookie("connect.sid", "", { maxAge: 1 });

  //Destroy session
  req.session.destroy;

  //Redirect user to home page but can not see dashboard because it does not authenticate so user redirect  to login page finally.
  res.status(500).redirect("/");
};
