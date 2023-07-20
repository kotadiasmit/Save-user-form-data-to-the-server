import formidable from "formidable-serverless";
import { Form } from "../model/model.js";

const uploadFormDetails = async (req, res) => {
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res
        .status(500)
        .json({ message: `Failed to process file upload ${err}` });
    }

    const { username, email, password, password2 } = fields;
    const selectedFile = files.file;

    if (!selectedFile) {
      return res.status(400).json({ message: "No file received" });
    }

    // Save the file details in MongoDB
    const fileDetails = {
      filename: selectedFile.name,
      originalname: selectedFile.name,
      mimetype: selectedFile.type,
      size: selectedFile.size,
      path: selectedFile.path,
    };

    const newFormData = {
      username,
      email,
      password,
      selectedFile: fileDetails,
    };
    Form.create(newFormData)
      .then(() => {
        res.status(200).json({ message: "File uploaded and saved" });
      })
      .catch((err) => {
        console.error("Error saving file to MongoDB:", err);
        res.status(500).json({ message: `Failed to save file ${err}` });
      });
  });
};

export const FormController = { uploadFormDetails };
