import { Router, Express } from "express";
import auth from "../middlewares/auth";

const router = Router();

router.get("/", (req, res) => {
  const { userId } = req.body;

  res.send("ok");
});

export default (app: Express) => app.use("/projects", auth, router);
