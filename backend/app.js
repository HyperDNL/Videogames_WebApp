// Módulos
import express from "express";
import videogamesRoutes from "./routes/videogames.routes.js";
import { connectDatabase } from "./database.js";
import { PORT } from "./config/config.js";

// Inicializaciones
const app = express();
connectDatabase();

// Configuraciones
app.set("port", PORT);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas
app.use(videogamesRoutes);

export default app;
