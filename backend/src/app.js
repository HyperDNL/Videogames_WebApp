import express from "express";
import cors from "cors";
import morgan from "morgan";
import fileUpload from "express-fileupload";
import { connectDB } from "./utils/database.js";
import { PORT, WHITELISTED_DOMAINS } from "./config/config.js";
import videogamesRoutes from "./routes/videogames.routes.js";

// Initializations
const app = express();
connectDB();

// Settings
app.set("port", PORT);

const whitelist = WHITELISTED_DOMAINS ? WHITELISTED_DOMAINS.split(",") : [];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },

  credentials: true,
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(
  fileUpload({
    tempFileDir: "./upload",
    useTempFiles: true,
  })
);
app.use(morgan("dev"));

// Routes
app.use("/api/videogames", videogamesRoutes);

export default app;
