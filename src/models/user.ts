import mongoose from "mongoose";
import bcrypt from "bcrypt";

export type IUser = {
  name: string;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
  _id: string;
};

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;

  next();
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
