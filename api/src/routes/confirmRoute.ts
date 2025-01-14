import express from "express";
const router = express.Router();

const confirmController = require("../controllers/confirmController");

router.patch("/", confirmController.confirm);

export default router;
