import { Router } from "express";

import { uploadToMemory } from "../../../middleware/file.js";
import { postChat } from "./post-chat.js";
import { postUploadPhoto } from "./post-upload-photo.js";

export function aiRouter() {
  const router = Router();

  router.post("/chat", postChat);
  router.post("/upload-photo", uploadToMemory.single("image"), postUploadPhoto);

  return router;
}
