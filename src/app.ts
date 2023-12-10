import express from "express";
import "./database";

import authController from "./controllers/authController";
import projectController from "./controllers/projectController";
import { AppDataSource } from "./database";

AppDataSource.initialize()
  .then(async () => {
    const app = express();
    app.use(express.json());

    authController(app);
    projectController(app);

    app.get("/", (req, res) => {
      return res.send("OK");
    });

    app.listen(3000);
  })
  .catch((error) => console.log(error));
