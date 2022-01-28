import "reflect-metadata";
import express from "express";
import userRoutes from "./routes/user.routes";
import homeRoutes from "./routes/home.routes";
import path from "path";
import cookieParser from "cookie-parser";
import session from "express-session";
import dotenv from "dotenv";

import { createConnection } from "typeorm";

dotenv.config();

const app = express();
createConnection();

//Session definition

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

declare module "express-session" {
  interface Session {
    userId: number;
    userAgent: string;
    isLoggedIn: boolean;
  }
}

//Middlewares
//-----------------------------

//Template Engine
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");

app.use(express.static("src/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

//Routes

app.use(userRoutes);
app.use(homeRoutes);

//404 Page route
app.get("*", function (req, res) {
  res.status(404).render("error");
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Sunucu port ${port} da başlatıldı.`);
});
