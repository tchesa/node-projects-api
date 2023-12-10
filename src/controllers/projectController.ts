import { Router, Express } from "express";
import auth from "../middlewares/auth";
import Project from "../entities/Project";
import Task from "../entities/Task";
import { AppDataSource } from "../database";
import User from "../entities/User";
import { ObjectId } from "mongodb";

const router = Router();

router.get("/", async (_, res) => {
  try {
    const repo = AppDataSource.getMongoRepository(Project);
    const userRepo = AppDataSource.getMongoRepository(User);
    const taskRepo = AppDataSource.getMongoRepository(Task);

    const projects = await repo.find();

    const userIds: string[] = [];
    const taskIds: string[] = [];

    projects.forEach((project) => {
      userIds.push(project.user.toString());
      taskIds.push(...project.tasks.map((task) => task.toString()));
    });

    const usersSet = new Set(userIds);
    const tasksSet = new Set(taskIds);

    const users = await Promise.all(
      Array.from(usersSet).map((userId) =>
        userRepo.findOneBy({
          _id: new ObjectId(userId),
        })
      )
    );

    const tasks = await Promise.all(
      Array.from(tasksSet).map((taskId) =>
        taskRepo.findOneBy({
          _id: new ObjectId(taskId),
        })
      )
    );

    const usersMap = users.reduce<Record<string, User>>((map, user) => {
      return {
        ...map,
        [user._id.toString()]: user,
      };
    }, {});

    const tasksMap = tasks.reduce<Record<string, Task>>((map, task) => {
      return {
        ...map,
        [task._id.toString()]: task,
      };
    }, {});

    projects.forEach((project) => {
      project.user = usersMap[project.user.toString()];

      for (let i = 0; i < project.tasks.length; i++) {
        project.tasks[i] = tasksMap[project.tasks[i].toString()];
      }

      project.user.password = undefined;
    });

    return res.send(projects);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const repo = AppDataSource.getMongoRepository(Project);
    const taskRepo = AppDataSource.getMongoRepository(Task);
    const userRepo = AppDataSource.getMongoRepository(User);
    const project = await repo.findOneBy({ _id: new ObjectId(id) });

    const tasks = await Promise.all(
      project.tasks.map((taskId) =>
        taskRepo.findOneBy({ _id: new ObjectId(taskId.toString()) })
      )
    );

    const user = await userRepo.findOneBy({
      _id: new ObjectId(project.user.toString()),
    });

    user.password = undefined;
    project.user = user;

    project.tasks.forEach((_, i) => {
      project.tasks[i] = tasks[i];
    });

    return res.send(project);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
});

router.post("/", async (req, res) => {
  const { userId, title, description, tasks } = req.body;

  try {
    const repo = AppDataSource.getMongoRepository(Project);
    const taskRepo = AppDataSource.getMongoRepository(Task);

    const project = repo.create({
      title,
      description,
      user: new ObjectId(userId),
    });

    await repo.save(project);

    const createdTasks = tasks.map((task) =>
      taskRepo.create({
        ...task,
        project: project._id,
        completed: task.completed ?? false,
      })
    );

    await Promise.all(createdTasks.map((task) => taskRepo.save(task)));

    project.tasks = createdTasks.map((task) => task._id);
    await repo.save(project);

    return res.send(project);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
});

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
