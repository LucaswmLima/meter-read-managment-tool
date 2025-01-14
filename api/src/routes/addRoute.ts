import express from "express";
const router = express.Router();

const addController = require("../controllers/addController");

router.post("/", addController.create);

export default router;
