import { Router } from "express";
import {
  createVideogame,
  getVideogames,
  getVideogamesSorted,
  searchByQuery,
  getVideogame,
  updateVideogame,
  deleteVideogame,
  deleteThumbnail,
} from "../controllers/videogames.controllers.js";

const router = Router();

router.post("/", createVideogame);

router.get("/", getVideogames);

router.get("/sort", getVideogamesSorted);

router.get("/search", searchByQuery);

router.get("/:id", getVideogame);

router.put("/:id", updateVideogame);

router.delete("/:id", deleteVideogame);

router.delete("/:id/thumbnails/:thumbnailId", deleteThumbnail);

export default router;
