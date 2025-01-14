import express from "express";
const router = express.Router();

const listController = require("../controllers/listController");

router.get("/:customer_code/list", listController.list);

export default router;
