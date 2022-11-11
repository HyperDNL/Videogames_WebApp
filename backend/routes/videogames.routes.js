import { Router } from "express";
import { getVideogames } from "../controllers/videogames.controllers.js";

const router = Router();

router.get("/", getVideogames);

router.get("/videogames", getVideogames);

export default router;
