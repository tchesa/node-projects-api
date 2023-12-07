import express from "express";
import "./database";

import authController from "./controllers/authController";
import projectController from "./controllers/projectController";

const app = express();
app.use(express.json());

authController(app);
projectController(app);

app.get("/", (req, res) => {
  return res.send("OK");
});

app.listen(3000);
