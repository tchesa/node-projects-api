import { Router, Express } from "express";
import auth from "../middlewares/auth";
import Project from "../entities/Project";
import Task from "../entities/Task";
import { AppDataSource } from "../database";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const repo = AppDataSource.getMongoRepository(Project);
    // const projects = await Project.find().populate(["user", "tasks"]);
    const projects = await repo.find();
    return res.send(projects);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
});

// router.get("/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const project = await Project.findById(id).populate(["user", "tasks"]);
//     return res.send(project);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({ error: "Server error" });
//   }
// });

// router.post("/", async (req, res) => {
//   const { userId, title, description, tasks } = req.body;

//   try {
//     const project = await Project.create({ title, description, user: userId });

//     const createdTasks = await Promise.all(
//       tasks.map((task: any) => {
//         const projectTask = new Task({ ...task, project: project._id });

//         return projectTask.save();
//       })
//     );

//     createdTasks.forEach((task) => project.tasks.push(task));
//     await project.save();

//     return res.send(project);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({ error: "Server error" });
//   }
// });

// router.put("/:id", async (req, res) => {
//   const { userId, title, description, tasks } = req.body;
//   const { id } = req.params;

//   try {
//     const project = await Project.findByIdAndUpdate(
//       id,
//       {
//         title,
//         description,
//         user: userId,
//       },
//       { new: true }
//     );

//     if (!project) {
//       return res.status(404).send({ error: "Project not found" });
//     }

//     project.tasks = [];
//     await Task.deleteMany({ project: project._id });

//     const createdTasks = await Promise.all(
//       tasks.map((task: any) => {
//         const projectTask = new Task({ ...task, project: project._id });

//         return projectTask.save();
//       })
//     );

//     createdTasks.forEach((task) => project.tasks.push(task));
//     await project.save();

//     return res.send(project);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({ error: "Server error" });
//   }
// });

// router.delete("/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     await Project.findByIdAndDelete(id);
//     return res.send();
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({ error: "Server error" });
//   }
// });

export default (app: Express) => app.use("/projects", auth, router);
