import mongoose, { model, models, Schema } from "mongoose";
import bcrypt from "bcryptjs";

interface UserSchemaType {
  email: string;
  password: string;
  username: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<UserSchemaType>(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  return next();
});

export const User = models.User || model("User", UserSchema);
