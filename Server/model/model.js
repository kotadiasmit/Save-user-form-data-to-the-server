import mongoose from "mongoose";

const Schema = mongoose.Schema;
const FormSchema = new Schema({
  username: String,
  email: String,
  password: String,
  selectedFile: {
    filename: String,
    originalname: String,
    mimetype: String,
    size: Number,
    path: String,
  },
});
export const Form = mongoose.model("form", FormSchema);
