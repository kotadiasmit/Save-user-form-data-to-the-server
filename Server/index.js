//file_upload_example
// Import required modules
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./router/router.js";

dotenv.config();
const app = express();
const PORT = 2000 || 2001;

mongoose
  .connect("mongodb://localhost:27017/file_upload_example", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connect To MongoDB Database");
  })
  .catch((err) => console.log(err));

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
app.use(express.json());
app.use(cors());
app.use("/", routes);
