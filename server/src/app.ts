import express from "express";
import cors from "cors";
import mainRoutes from "./routes/media.routes.js";
import authRoutes from "./routes/auth.routes.ts";
import path from "path";
import { pool } from "./config/db.ts";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5002",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "PERN TMDB API Running 🚀" });
});

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api", mainRoutes);

app.use("/auth", authRoutes);

app.get("/favicon.ico", (req, res) => res.status(204).end());

app.get("/movies/count", async (req, res) => {
  const result = await pool.query("SELECT COUNT(*) FROM movies");

  res.json({
    total: Number(result.rows[0].count),
  });
});

app.get("/tv/count", async (req, res) => {
  const result = await pool.query("SELECT COUNT(*) FROM tvshows");
  res.json({ total: Number(result.rows[0].count) });
});

export default app;
