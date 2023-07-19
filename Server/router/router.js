import express from "express";
import { FormController } from "../controller/controller.js";

const { uploadFormDetails } = FormController;

const router = express.Router();

router.post("/submit-form", uploadFormDetails);

export default router;
