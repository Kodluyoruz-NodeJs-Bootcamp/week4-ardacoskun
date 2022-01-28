import { Entity, PrimaryGeneratedColumn, Column, getRepository } from "typeorm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

function formatDate() {
  var d = new Date(),
    day = "" + d.getDate(),
    month = "" + (d.getMonth() + 1),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [day, month, year].join("/");
}

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  userName: string;

  @Column()
  password: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ default: formatDate() })
  createdAt: string;

  //Password hashing function it calls when user signing up.
  async hashPassword() {
    try {
      const user = this;
      user.password = await bcrypt.hash(user.password, 8);

      return user;
    } catch (error) {
      throw new Error("Hashing pasword error");
    }
  }

  //This function gets userName and password parameters and check login needs.
  async findByCredentials(userName: string, password: string) {
    try {
      const user = await getRepository(User).findOne({ userName });

      if (!user) {
        throw "User is not found";
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw "Please check your username or password";
      }

      return user;
    } catch (error) {
      throw "Credentials Error";
    }
  }

  //Create JWT function .
  async generateAuthToken(userAgent: string) {
    //Token expire date
    const maxAge = 3 * 24 * 60 * 60;
    const user: User = this;
    const token: string = jwt.sign({ id: user.id, userAgent }, "secretkey", {
      expiresIn: maxAge,
    });

    if (!token) {
      throw new Error("Token can not created");
    }

    return token;
  }
}
