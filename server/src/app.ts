import express from "express";
import cors from "cors";
import mainRoutes from "./routes/media.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "PERN TMDB API Running 🚀" });
});

app.use("/api", mainRoutes);

app.use("/auth", authRoutes);

app.get("/favicon.ico", (req, res) => res.status(204).end());

export default app;
