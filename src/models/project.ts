import mongoose, { Schema } from "mongoose";
import { IUser } from "./user";
import { ITask } from "./task";

export type IProject = {
  title: string;
  description: string;
  user: IUser;
  tasks: ITask[];
  created_at: string;
  updated_at: string;
  _id: string;
};

const projectSchema = new mongoose.Schema<IProject>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
  },
  { timestamps: true }
);

const projectModel = mongoose.model("Project", projectSchema);

export default projectModel;
