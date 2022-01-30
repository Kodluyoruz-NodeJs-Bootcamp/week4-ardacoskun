import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import bcrypt, { hash } from "bcrypt";
import multer from "multer";

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

//Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.

export const upload = multer({
  //storage: multer.memoryStorage(),
  limits: {
    fileSize: 1000000,
  },
});

//User profile update
export const userUpdate = async (req: Request, res: Response) => {
  const id = req.session.userId;

  const { firstName, lastName, password, userName } = req.body;

  //Convert buffer to base64 string
  const image = req.file?.buffer.toString("base64");

  //Hash updated password
  const hashedPassword = await bcrypt.hash(password, 8);

  try {
    const userRepository = getRepository(User);

    //If user does not update image,db continues to keep old one.
    //This pile is used for prevent null password and image saves to db

    if (image === undefined && password === "") {
      const updatedUser = await userRepository.update(id, {
        firstName,
        lastName,
        userName,
      });
    } else if (image === undefined && password) {
      const updatedUser = await userRepository.update(id, {
        firstName,
        lastName,
        userName,
        password: hashedPassword,
      });
    } else if (image && password === "") {
      const updatedUser = await userRepository.update(id, {
        firstName,
        lastName,
        userName,
        avatar: image,
      });
    } else {
      const updatedUser = await userRepository.update(id, {
        firstName,
        lastName,
        userName,
        password: hashedPassword,
        avatar: image,
      });
    }

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
  //Clear cookies
  res.cookie("jwt", "", { maxAge: 1 });
  res.cookie("connect.sid", "", { maxAge: 1 });

  //Destroy session
  req.session.destroy;

  //Redirect user to home page but can not see dashboard because it does not authenticate so user redirect  to login page finally.
  res.status(500).redirect("/");
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ id: req.session.userId });

    if (!user) {
      throw "User is not found.";
    }
    //Delete current user account
    await userRepository.delete(user);

    //Clear cookies
    res.cookie("jwt", "", { maxAge: 1 });
    res.cookie("connect.sid", "", { maxAge: 1 });

    //Destroy session
    req.session.destroy;

    return res.status(200).redirect("/register");
  } catch (error) {
    return res.status(500);
  }
};
