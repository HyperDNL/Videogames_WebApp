import fs from "fs-extra";
import Videogame from "../models/videogame.model.js";
import { uploadImage, deleteImage } from "../libs/cloudinary.js";
import {
  validateStringField,
  validateNumberField,
  validateArrayField,
  validateArrayElements,
} from "../libs/validators.js";

export const createVideogame = async (req, res) => {
  try {
    const { body, files } = req;

    const { title, description, year, developers, platforms, genres } = body;
    const developersData = developers
      ? validateArrayField(developers)
        ? developers
        : [developers]
      : [];
    const platformsData = platforms
      ? validateArrayField(platforms)
        ? platforms
        : [platforms]
      : [];
    const genresData = genres
      ? validateArrayField(genres)
        ? genres
        : [genres]
      : [];

    const errors = [];

    if (
      !title ||
      !description ||
      !year ||
      developersData.length === 0 ||
      platformsData.length === 0 ||
      genresData.length === 0
    ) {
      errors.push({
        error: "Required fields are missing or empty",
      });
    }

    if (!validateStringField(title)) {
      errors.push({
        error: "Invalid data type in Title. Expected string.",
      });
    }

    if (!validateStringField(description)) {
      errors.push({
        error: "Invalid data type in Description. Expected string.",
      });
    }

    if (!validateNumberField(year)) {
      errors.push({
        error: "Invalid data type in Year. Expected number.",
      });
    }

    if (!validateArrayElements(developersData)) {
      errors.push({
        error: "Invalid data type in Developers. Expected array of strings.",
      });
    }

    if (!validateArrayElements(platformsData)) {
      errors.push({
        error: "Invalid data type in Platforms. Expected array of strings.",
      });
    }

    if (!validateArrayElements(genresData)) {
      errors.push({
        error: "Invalid data type in Genres. Expected array of strings.",
      });
    }

    if (!files || !files.cover || !files.landscape) {
      errors.push({ error: "Cover and landscape images are required" });
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const { cover, landscape, thumbnails } = files;

    let squareCoverResult, landscapeCoverResult, thumbnailResults;

    squareCoverResult = await uploadImage(cover.tempFilePath);
    landscapeCoverResult = await uploadImage(landscape.tempFilePath);

    await fs.remove(cover.tempFilePath);
    await fs.remove(landscape.tempFilePath);

    if (thumbnails) {
      if (validateArrayField(thumbnails)) {
        thumbnailResults = await Promise.all(
          thumbnails.map(async (thumbnail) => {
            const thumbnailResult = await uploadImage(thumbnail.tempFilePath);
            await fs.remove(thumbnail.tempFilePath);
            return thumbnailResult;
          })
        );
      } else {
        const thumbnailResult = await uploadImage(thumbnails.tempFilePath);
        await fs.remove(thumbnails.tempFilePath);
        thumbnailResults = [thumbnailResult];
      }
    }

    const newVideogame = new Videogame({
      title,
      description,
      developers: developersData.map((developer) => ({ developer })),
      platforms: platformsData.map((platform) => ({ platform })),
      genres: genresData.map((genre) => ({ genre })),
      year,
      covers: {
        cover: {
          url: squareCoverResult.secure_url,
          public_id: squareCoverResult.public_id,
        },
        landscape: {
          url: landscapeCoverResult.secure_url,
          public_id: landscapeCoverResult.public_id,
        },
      },
      thumbnails: thumbnailResults
        ? thumbnailResults.map((thumbnailResult) => ({
            thumbnail: thumbnailResult.secure_url,
            public_id: thumbnailResult.public_id,
          }))
        : [],
    });

    await newVideogame.save();

    res.status(201).json(newVideogame);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};

export const getVideogames = async (req, res) => {
  try {
    const videogames = await Videogame.find().sort({ title: 1 });

    const formattedVideogames = videogames.map(
      ({
        _id,
        title,
        description,
        developers,
        platforms,
        genres,
        year,
        covers,
        thumbnails,
      }) => {
        return {
          _id,
          title,
          description,
          developers,
          platforms,
          genres,
          year,
          covers,
          thumbnails,
        };
      }
    );

    return res.status(200).json(formattedVideogames);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};

export const getVideogamesSorted = async (req, res) => {
  try {
    const { query } = req;
    const { field, order } = query;

    let sortField;

    switch (field) {
      case "title":
        sortField = "title";
        break;
      case "developers":
        sortField = "developers.developer";
        break;
      case "platforms":
        sortField = "platforms.platform";
        break;
      case "genres":
        sortField = "genres.genre";
        break;
      case "year":
        sortField = "year";
        break;
      default:
        return res.status(400).json({ message: "Invalid sort field" });
    }

    const sortOrder = order === "desc" ? -1 : 1;

    const sortedDocuments = await Videogame.find()
      .sort({ [sortField]: sortOrder })
      .exec();

    const formattedVideogames = sortedDocuments.map(
      ({
        _id,
        title,
        description,
        developers,
        platforms,
        genres,
        year,
        covers,
        thumbnails,
      }) => {
        return {
          _id,
          title,
          description,
          developers,
          platforms,
          genres,
          year,
          covers,
          thumbnails,
        };
      }
    );

    res.json(formattedVideogames);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};

export const searchByQuery = async (req, res) => {
  try {
    const { query } = req;
    const { title, developer, platform, genre, year } = query;

    if (!title && !developer && !platform && !genre && !year) {
      return res
        .status(400)
        .json({ message: "At least one valid search parameter is required" });
    }

    const searchQuery = {};

    if (title) {
      const regex = new RegExp(title, "i");
      searchQuery.title = regex;
    }

    const orQuery = [];

    if (developer) {
      orQuery.push({ "developers.developer": new RegExp(developer, "i") });
    }

    if (platform) {
      orQuery.push({ "platforms.platform": new RegExp(platform, "i") });
    }

    if (genre) {
      orQuery.push({ "genres.genre": new RegExp(genre, "i") });
    }

    if (year) {
      if (!validateNumberField(year)) {
        return res
          .status(400)
          .json({ message: "Invalid data type in Year. Expected number." });
      }
      orQuery.push({ year: parseInt(year) });
    }

    if (orQuery.length > 0) {
      searchQuery.$or = orQuery;
    }

    const videogames = await Videogame.find(searchQuery).sort({ title: 1 });

    const formattedVideogames = videogames.map(
      ({
        _id,
        title,
        description,
        developers,
        platforms,
        genres,
        year,
        covers,
        thumbnails,
      }) => {
        return {
          _id,
          title,
          description,
          developers,
          platforms,
          genres,
          year,
          covers,
          thumbnails,
        };
      }
    );

    res.json(formattedVideogames);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};

export const getVideogame = async (req, res) => {
  try {
    const { params } = req;
    const { id } = params;

    const videogame = await Videogame.findById(id);

    if (!videogame)
      return res.status(404).json({ message: "Videogame not found" });

    const {
      _id,
      title,
      description,
      developers,
      platforms,
      genres,
      year,
      covers,
      thumbnails,
    } = videogame;

    const formattedVideogame = {
      _id,
      title,
      description,
      developers,
      platforms,
      genres,
      year,
      covers,
      thumbnails,
    };

    return res.status(200).json(formattedVideogame);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};

export const updateVideogame = async (req, res) => {
  try {
    const { body, files, params } = req;
    const { id } = params;

    const { title, description, year, developers, platforms, genres } = body;
    const developersData = developers
      ? validateArrayField(developers)
        ? developers
        : [developers]
      : [];
    const platformsData = platforms
      ? validateArrayField(platforms)
        ? platforms
        : [platforms]
      : [];
    const genresData = genres
      ? validateArrayField(genres)
        ? genres
        : [genres]
      : [];

    const videogame = await Videogame.findById(id);

    if (!videogame) {
      return res.status(404).json({ message: "Videogame not found" });
    }

    const errors = [];

    if (
      !title ||
      !description ||
      !year ||
      developersData.length === 0 ||
      platformsData.length === 0 ||
      genresData.length === 0
    ) {
      errors.push({
        error: "Required fields are missing or empty",
      });
    }

    if (!validateStringField(title)) {
      errors.push({
        error: "Invalid data type in Title. Expected string.",
      });
    }

    if (!validateStringField(description)) {
      errors.push({
        error: "Invalid data type in Description. Expected string.",
      });
    }

    if (!validateNumberField(year)) {
      errors.push({
        error: "Invalid data type in Year. Expected number.",
      });
    }

    if (!validateArrayElements(developersData)) {
      errors.push({
        error: "Invalid data type in Developers. Expected array of strings.",
      });
    }

    if (!validateArrayElements(platformsData)) {
      errors.push({
        error: "Invalid data type in Platforms. Expected array of strings.",
      });
    }

    if (!validateArrayElements(genresData)) {
      errors.push({
        error: "Invalid data type in Genres. Expected array of strings.",
      });
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    let squareCoverResult, landscapeCoverResult, thumbnailResults;

    if (files && files.cover && files.landscape) {
      await deleteImage(videogame.covers.cover.public_id);
      await deleteImage(videogame.covers.landscape.public_id);

      const { cover, landscape } = files;

      squareCoverResult = await uploadImage(cover.tempFilePath);
      landscapeCoverResult = await uploadImage(landscape.tempFilePath);

      await Promise.all([
        fs.remove(cover.tempFilePath),
        fs.remove(landscape.tempFilePath),
      ]);
    } else {
      squareCoverResult = videogame.covers.cover;
      landscapeCoverResult = videogame.covers.landscape;
    }

    if (files && files.thumbnails) {
      const { thumbnails } = files;

      if (validateArrayField(thumbnails)) {
        thumbnailResults = await Promise.all(
          files.thumbnails.map(async (thumbnail) => {
            const thumbnailResult = await uploadImage(thumbnail.tempFilePath);
            await fs.remove(thumbnail.tempFilePath);
            return thumbnailResult;
          })
        );
      } else {
        const thumbnailResult = await uploadImage(
          files.thumbnails.tempFilePath
        );
        await fs.remove(files.thumbnails.tempFilePath);
        thumbnailResults = [thumbnailResult];
      }
    } else {
      thumbnailResults = videogame.thumbnails;
    }

    const updatedVideogame = {
      title,
      description,
      developers: developersData.map((developer) => ({ developer })),
      platforms: platformsData.map((platform) => ({ platform })),
      genres: genresData.map((genre) => ({ genre })),
      year,
      covers: {
        cover: {
          url: squareCoverResult.url,
          public_id: squareCoverResult.public_id,
        },
        landscape: {
          url: landscapeCoverResult.url,
          public_id: landscapeCoverResult.public_id,
        },
      },
      thumbnails: [...videogame.thumbnails, ...(thumbnailResults || [])],
    };

    const updatedVideogameDocument = await Videogame.findByIdAndUpdate(
      id,
      updatedVideogame,
      { new: true }
    );

    res.json(updatedVideogameDocument);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};

export const deleteVideogame = async (req, res) => {
  try {
    const { params } = req;
    const { id } = params;

    const videogame = await Videogame.findByIdAndDelete(id);

    if (!videogame)
      return res.status(404).json({ message: "Videogame not found" });

    await deleteImage(videogame.covers.cover.public_id);
    await deleteImage(videogame.covers.landscape.public_id);

    const thumbnailDeletionPromises = videogame.thumbnails.map((thumbnail) =>
      deleteImage(thumbnail.public_id)
    );
    await Promise.all(thumbnailDeletionPromises);

    res.sendStatus(204);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};

export const deleteThumbnail = async (req, res) => {
  try {
    const { params } = req;
    const { id, thumbnailId } = params;

    const videogame = await Videogame.findById(id);

    if (!videogame) {
      return res.status(404).json({ message: "Videogame not found" });
    }

    const thumbnailIndex = videogame.thumbnails.findIndex(
      (thumbnail) => thumbnail._id == thumbnailId
    );

    if (thumbnailIndex === -1) {
      return res.status(404).json({ message: "Thumbnail not found" });
    }

    const { public_id } = videogame.thumbnails[thumbnailIndex];

    await deleteImage(public_id);

    videogame.thumbnails.splice(thumbnailIndex, 1);

    await videogame.save();

    res.sendStatus(204);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};
