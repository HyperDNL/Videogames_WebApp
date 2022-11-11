import Videogame from "../models/Videogame.js";

export const getVideogames = async (req, res) => {
  try {
    const videogames = await Videogame.find();
    return res.json(videogames);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
