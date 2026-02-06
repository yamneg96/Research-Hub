import express from "express";
import {
  createResearch,
  deleteResearch,
  getResearchById,
  getResearchList,
  updateResearch
} from "../controllers/researchController.js";
import { requireAuth } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getResearchList);
router.get("/:id", getResearchById);
router.post("/", requireAuth, upload.fields([{ name: "thumbnail", maxCount: 1 }, { name: "coverImage", maxCount: 1 }]), createResearch);
router.put("/:id", requireAuth, upload.fields([{ name: "thumbnail", maxCount: 1 }, { name: "coverImage", maxCount: 1 }]), updateResearch);
router.delete("/:id", requireAuth, deleteResearch);

export default router;
