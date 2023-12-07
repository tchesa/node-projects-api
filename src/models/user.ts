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
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(this.password, salt);
  this.password = passwordHash;

  next();
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
