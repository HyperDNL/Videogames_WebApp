import { Schema, model } from "mongoose";

const videogameSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    developers: [
      {
        developer: {
          type: String,
          required: true,
        },
      },
    ],
    platforms: [
      {
        platform: {
          type: String,
          required: true,
        },
      },
    ],
    genres: [
      {
        genre: {
          type: String,
          required: true,
        },
      },
    ],
    year: {
      type: Number,
      required: true,
    },
    covers: {
      cover: {
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
      },
      landscape: {
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
      },
    },
    thumbnails: [
      {
        thumbnail: String,
        public_id: String,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Videogame", videogameSchema);
