import { Router, Express } from "express";
import bcrypt from "bcrypt";
import User from "../entities/User";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AppDataSource } from "../database";

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
    const repository = AppDataSource.getMongoRepository(User);

    if (await repository.findOneBy({ email })) {
      return res.status(400).json({ error: "User already registered" });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = repository.create({ name, email, password: passwordHash });
    await repository.save(user);

    user.password = undefined;

    const token = generateToken(user._id.toString());

    return res.json({ user, token });
  } catch (error) {
    return res.status(400).json({ error: "Registration failed" });
  }
});

router.post("/authenticate", async (req, res) => {
  const { email, password } = req.body;

  const repository = AppDataSource.getMongoRepository(User);

  const user = await repository.findOneBy({ email });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (!(await bcrypt.compare(password, user.password!))) {
    return res.status(400).json({ error: "Invalid password" });
  }

  user.password = undefined;

  const token = generateToken(user._id.toString());

  res.send({ user, token });
});

export default (app: Express) => app.use("/auth", router);
