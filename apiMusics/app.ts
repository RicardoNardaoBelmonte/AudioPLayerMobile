import express from "express";
import cors from "cors";
import routes from "./Routes.js";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

const publicPath = path.resolve(__dirname, "public");
app.use("/public", express.static(publicPath));
console.log("Servindo arquivos estáticos de:", publicPath);

app.use("/public", express.static(publicPath));

app.use("/api", routes);

export default app;
