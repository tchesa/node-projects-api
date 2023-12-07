import { Router, Express } from "express";
import bcrypt from "bcrypt";
import User, { IUser } from "../models/user";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "", {
    expiresIn: 86400,
  });
};

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ error: "User already registered" });
    }

    const user = (await User.create({ name, email, password })) as Omit<
      IUser,
      "password"
    > & { password?: string };

    user.password = undefined;

    const token = generateToken(user._id);

    return res.json({ user, token });
  } catch (error) {
    return res.status(400).json({ error: "Registration failed" });
  }
});

router.post("/authenticate", async (req, res) => {
  const { email, password } = req.body;

  const user = (await User.findOne({ email }).select("+password")) as Omit<
    IUser,
    "password"
  > & { password?: string };

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (!(await bcrypt.compare(password, user.password!))) {
    return res.status(400).json({ error: "Invalid password" });
  }

  user.password = undefined;

  const token = generateToken(user._id);

  res.send({ user, token });
});

export default (app: Express) => app.use("/auth", router);
