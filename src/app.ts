import express from "express";
import "./database";

import authController from "./controllers/authController";

const app = express();
app.use(express.json());

authController(app);

app.get("/", (req, res) => {
  return res.send("OK");
});

app.listen(3000);
