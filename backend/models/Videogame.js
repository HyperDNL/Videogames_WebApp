import mongoose from "mongoose";

const videogameSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    developer: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
      trim: true,
    },
    platform: {
      type: [String],
      required: true,
    },
    coverImage: {
      type: String,
      trim: true,
    },
    thumbnails: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Videogame", videogameSchema);
