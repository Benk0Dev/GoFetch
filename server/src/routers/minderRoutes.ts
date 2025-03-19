import express from "express";
import fs from "fs";
const router = express.Router();

router.get("/minders", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync("./src/db/users.json", "utf-8"));
    const minders = data.filter((user: any) => user.roles.includes("petminder"));
    res.json(minders);
  } catch (err) {
    console.error("Error reading users.json:", err);
    res.status(500).send("Server Error");
  }
});

export default router;

