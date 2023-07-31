import fs from "fs-extra";
import Videogame from "../models/videogame.model.js";
import { uploadImage, deleteImage } from "../libs/cloudinary.js";
import {
  validateStringField,
  validateNumberField,
  validateArrayField,
  validateArrayElements,
  arraysAreEqual,
} from "../libs/validators.js";
import {
  getExtension,
  isValidImageExtension,
  getFileSizeInMB,
} from "../libs/imagesHandling.js";
import { MAX_IMAGE_SIZE_MB } from "../config/config.js";

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

    if (title && !validateStringField(title)) {
      errors.push({
        error: "Invalid data type in Title. Expected string.",
      });
    }

    if (description && !validateStringField(description)) {
      errors.push({
        error: "Invalid data type in Description. Expected string.",
      });
    }

    if (year && !validateNumberField(year)) {
      errors.push({
        error: "Invalid data type in Year. Expected number.",
      });
    }

    if (developersData && !validateArrayElements(developersData)) {
      errors.push({
        error: "Invalid data type in Developers. Expected array of strings.",
      });
    }

    if (platformsData && !validateArrayElements(platformsData)) {
      errors.push({
        error: "Invalid data type in Platforms. Expected array of strings.",
      });
    }

    if (genresData && !validateArrayElements(genresData)) {
      errors.push({
        error: "Invalid data type in Genres. Expected array of strings.",
      });
    }

    if (!files || !files.cover || !files.landscape) {
      errors.push({ error: "Cover and landscape images are required" });
    }

    let squareCoverResult, landscapeCoverResult, thumbnailResults;

    let coverToUpload = null;
    let landscapeToUpload = null;
    const thumbnailsToUpload = [];

    if (files && files.cover && files.landscape) {
      const { cover, landscape } = files;

      const coverExtension = getExtension(cover.name);
      const landscapeExtension = getExtension(landscape.name);

      if (!isValidImageExtension(coverExtension)) {
        errors.push({
          error:
            "Invalid cover type. Only JPG, PNG, and WebP images are allowed.",
        });
      }

      if (!isValidImageExtension(landscapeExtension)) {
        errors.push({
          error:
            "Invalid landscape type. Only JPG, PNG, and WebP images are allowed.",
        });
      }

      const coverSize = getFileSizeInMB(cover.size);
      const landscapeSize = getFileSizeInMB(landscape.size);

      if (coverSize > MAX_IMAGE_SIZE_MB) {
        errors.push({
          error: `Cover size exceeds the maximum allowed (${MAX_IMAGE_SIZE_MB}MB).`,
        });
      }

      if (landscapeSize > MAX_IMAGE_SIZE_MB) {
        errors.push({
          error: `Landscape size exceeds the maximum allowed (${MAX_IMAGE_SIZE_MB}MB).`,
        });
      }

      coverToUpload = cover.tempFilePath;
      landscapeToUpload = landscape.tempFilePath;
    }

    if (files && files.thumbnails) {
      const { thumbnails } = files;

      if (validateArrayField(thumbnails)) {
        thumbnails.forEach(({ name, size, tempFilePath }) => {
          const thumbnailExtension = getExtension(name);
          if (!isValidImageExtension(thumbnailExtension)) {
            errors.push({
              error: `Invalid thumbnail type (${name}). Only JPG, PNG, and WebP images are allowed.`,
            });
          }

          const thumbnailSize = getFileSizeInMB(size);
          if (thumbnailSize > MAX_IMAGE_SIZE_MB) {
            errors.push({
              error: `Thumbnail size (${name}) exceeds the maximum allowed (${MAX_IMAGE_SIZE_MB}MB).`,
            });
          }

          thumbnailsToUpload.push({ tempFilePath });
        });
      } else {
        const { name, size, tempFilePath } = thumbnails;

        const thumbnailExtension = getExtension(name);
        if (!isValidImageExtension(thumbnailExtension)) {
          errors.push({
            error: `Invalid thumbnail type (${name}). Only JPG, PNG, and WebP images are allowed.`,
          });
        }

        const thumbnailSize = getFileSizeInMB(size);
        if (thumbnailSize > MAX_IMAGE_SIZE_MB) {
          errors.push({
            error: `Thumbnail size (${name}) exceeds the maximum allowed (${MAX_IMAGE_SIZE_MB}MB).`,
          });
        }

        thumbnailsToUpload.push({ tempFilePath });
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    if (coverToUpload !== null && landscapeToUpload !== null) {
      try {
        squareCoverResult = await uploadImage(coverToUpload);
        landscapeCoverResult = await uploadImage(landscapeToUpload);

        await fs.remove(coverToUpload);
        await fs.remove(landscapeToUpload);
      } catch (error) {
        const { message } = error;
        return res.status(500).json({
          message: `Error uploading cover and landscape images: ${message}`,
        });
      }
    }

    if (thumbnailsToUpload.length > 0) {
      try {
        thumbnailResults = await Promise.all(
          thumbnailsToUpload.map(async ({ tempFilePath }) => {
            const thumbnailResult = await uploadImage(tempFilePath);
            await fs.remove(tempFilePath);
            return thumbnailResult;
          })
        );
      } catch (error) {
        const { message } = error;
        return res.status(500).json({
          message: `Error uploading thumbnails: ${message}`,
        });
      }
    }

    const newVideogame = await Videogame.create({
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
        ? thumbnailResults.map(({ secure_url, public_id }) => ({
            thumbnail: secure_url,
            public_id,
          }))
        : [],
    });

    res.status(201).json(newVideogame);
  } catch (error) {
    const { message } = error;
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${message}` });
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
    const { message } = error;
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${message}` });
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
    const { message } = error;
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${message}` });
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
    const { message } = error;
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${message}` });
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
    const { message } = error;
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${message}` });
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

    if (title && !validateStringField(title)) {
      errors.push({
        error: "Invalid data type in Title. Expected string.",
      });
    }

    if (description && !validateStringField(description)) {
      errors.push({
        error: "Invalid data type in Description. Expected string.",
      });
    }

    if (year && !validateNumberField(year)) {
      errors.push({
        error: "Invalid data type in Year. Expected number.",
      });
    }

    if (developersData && !validateArrayElements(developersData)) {
      errors.push({
        error: "Invalid data type in Developers. Expected array of strings.",
      });
    }

    if (platformsData && !validateArrayElements(platformsData)) {
      errors.push({
        error: "Invalid data type in Platforms. Expected array of strings.",
      });
    }

    if (genresData && !validateArrayElements(genresData)) {
      errors.push({
        error: "Invalid data type in Genres. Expected array of strings.",
      });
    }

    const updateValues = {};

    if (title && title !== videogame.title) {
      updateValues.title = title;
    }

    if (description && description !== videogame.description) {
      updateValues.description = description;
    }

    if (year && year !== videogame.year) {
      updateValues.year = year;
    }

    if (developers) {
      if (
        !arraysAreEqual(
          developersData,
          videogame.developers.map(({ developer }) => developer)
        )
      ) {
        updateValues.developers = developersData.map((developer) => ({
          developer,
        }));
      }
    }

    if (platforms) {
      if (
        !arraysAreEqual(
          platformsData,
          videogame.platforms.map(({ platform }) => platform)
        )
      ) {
        updateValues.platforms = platformsData.map((platform) => ({
          platform,
        }));
      }
    }

    if (genres) {
      if (
        !arraysAreEqual(
          genresData,
          videogame.genres.map(({ genre }) => genre)
        )
      ) {
        updateValues.genres = genresData.map((genre) => ({ genre }));
      }
    }

    let squareCoverResult, landscapeCoverResult, thumbnailResults;

    let coverToUpload = null;
    let landscapeToUpload = null;
    const thumbnailsToUpload = [];

    if (files && files.cover && files.landscape) {
      const { cover, landscape } = files;

      const coverExtension = getExtension(cover.name);
      const landscapeExtension = getExtension(landscape.name);

      if (!isValidImageExtension(coverExtension)) {
        errors.push({
          error:
            "Invalid cover type. Only JPG, PNG, and WebP images are allowed.",
        });
      }

      if (!isValidImageExtension(landscapeExtension)) {
        errors.push({
          error:
            "Invalid landscape type. Only JPG, PNG, and WebP images are allowed.",
        });
      }

      const coverSize = getFileSizeInMB(cover.size);
      const landscapeSize = getFileSizeInMB(landscape.size);

      if (coverSize > MAX_IMAGE_SIZE_MB) {
        errors.push({
          error: `Cover size exceeds the maximum allowed (${MAX_IMAGE_SIZE_MB}MB).`,
        });
      }

      if (landscapeSize > MAX_IMAGE_SIZE_MB) {
        errors.push({
          error: `Landscape size exceeds the maximum allowed (${MAX_IMAGE_SIZE_MB}MB).`,
        });
      }

      coverToUpload = cover.tempFilePath;
      landscapeToUpload = landscape.tempFilePath;
    }

    if (files && files.thumbnails) {
      const { thumbnails } = files;

      if (validateArrayField(thumbnails)) {
        thumbnails.forEach(({ name, size, tempFilePath }) => {
          const thumbnailExtension = getExtension(name);
          if (!isValidImageExtension(thumbnailExtension)) {
            errors.push({
              error: `Invalid thumbnail type (${name}). Only JPG, PNG, and WebP images are allowed.`,
            });
          }

          const thumbnailSize = getFileSizeInMB(size);
          if (thumbnailSize > MAX_IMAGE_SIZE_MB) {
            errors.push({
              error: `Thumbnail size (${name}) exceeds the maximum allowed (${MAX_IMAGE_SIZE_MB}MB).`,
            });
          }

          thumbnailsToUpload.push({ tempFilePath });
        });
      } else {
        const { name, size, tempFilePath } = thumbnails;

        const thumbnailExtension = getExtension(name);
        if (!isValidImageExtension(thumbnailExtension)) {
          errors.push({
            error: `Invalid thumbnail type (${name}). Only JPG, PNG, and WebP images are allowed.`,
          });
        }

        const thumbnailSize = getFileSizeInMB(size);
        if (thumbnailSize > MAX_IMAGE_SIZE_MB) {
          errors.push({
            error: `Thumbnail size (${name}) exceeds the maximum allowed (${MAX_IMAGE_SIZE_MB}MB).`,
          });
        }

        thumbnailsToUpload.push({ tempFilePath });
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    if (coverToUpload !== null && landscapeToUpload !== null) {
      try {
        if (
          videogame.covers.cover.public_id &&
          videogame.covers.landscape.public_id
        ) {
          await deleteImage(videogame.covers.cover.public_id);
          await deleteImage(videogame.covers.landscape.public_id);
        }

        squareCoverResult = await uploadImage(coverToUpload);
        landscapeCoverResult = await uploadImage(landscapeToUpload);

        await fs.remove(coverToUpload);
        await fs.remove(landscapeToUpload);

        updateValues.covers = {
          cover: {
            url: squareCoverResult.url,
            public_id: squareCoverResult.public_id,
          },
          landscape: {
            url: landscapeCoverResult.url,
            public_id: landscapeCoverResult.public_id,
          },
        };
      } catch (error) {
        const { message } = error;
        return res.status(500).json({
          message: `Error uploading cover and landscape images: ${message}`,
        });
      }
    }

    if (thumbnailsToUpload.length > 0) {
      try {
        thumbnailResults = await Promise.all(
          thumbnailsToUpload.map(async ({ tempFilePath }) => {
            const thumbnailResult = await uploadImage(tempFilePath);
            await fs.remove(tempFilePath);
            return thumbnailResult;
          })
        );

        updateValues.thumbnails = [
          ...videogame.thumbnails,
          ...(thumbnailResults
            ? thumbnailResults.map(({ secure_url, public_id }) => ({
                thumbnail: secure_url,
                public_id,
              }))
            : []),
        ];
      } catch (error) {
        const { message } = error;
        return res.status(500).json({
          message: `Error uploading thumbnails: ${message}`,
        });
      }
    }

    const updatedVideogameDocument = await Videogame.findByIdAndUpdate(
      id,
      updateValues,
      { new: true }
    );

    res.json(updatedVideogameDocument);
  } catch (error) {
    const { message } = error;
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${message}` });
  }
};

export const deleteVideogame = async (req, res) => {
  try {
    const { params } = req;
    const { id } = params;

    const videogame = await Videogame.findByIdAndDelete(id);

    if (!videogame)
      return res.status(404).json({ message: "Videogame not found" });

    try {
      await deleteImage(videogame.covers.cover.public_id);
      await deleteImage(videogame.covers.landscape.public_id);
    } catch (error) {
      const { message } = error;
      return res.status(500).json({
        message: `Error deleting cover and landscape images: ${message}`,
      });
    }

    if (videogame.thumbnails && videogame.thumbnails.length > 0) {
      try {
        const thumbnailDeletionPromises = videogame.thumbnails.map(
          ({ public_id }) => deleteImage(public_id)
        );
        await Promise.all(thumbnailDeletionPromises);
      } catch (error) {
        const { message } = error;
        return res
          .status(500)
          .json({ message: `Error deleting thumbnails: ${message}` });
      }
    }

    res.sendStatus(204);
  } catch (error) {
    const { message } = error;
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${message}` });
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

    try {
      const { public_id } = videogame.thumbnails[thumbnailIndex];

      await deleteImage(public_id);

      videogame.thumbnails.splice(thumbnailIndex, 1);

      await videogame.save();

      res.json({ message: "Thumbnail deleted successfully" });
    } catch (error) {
      const { message } = error;
      return res
        .status(500)
        .json({ message: `Error deleting thumbnail: ${message}` });
    }
  } catch (error) {
    const { message } = error;
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${message}` });
  }
};
