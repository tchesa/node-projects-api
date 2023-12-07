import mongoose, { Schema } from "mongoose";
import { IProject } from "./project";
import { IUser } from "./user";

export type ITask = {
  title: string;
  project: IProject;
  assignedTo: IUser;
  completed: boolean;
  created_at: string;
  updated_at: string;
  _id: string;
};

const taskSchema = new mongoose.Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    completed: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const taskModel = mongoose.model("Task", taskSchema);

export default taskModel;
