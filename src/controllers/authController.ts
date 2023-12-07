import { Router, Express } from "express";
import User, { IUser } from "../models/user";

const router = Router();

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

    return res.send({ user });
  } catch (error) {
    return res.status(400).send({ error: "Registration failed" });
  }
});

export default (app: Express) => app.use("/auth", router);
