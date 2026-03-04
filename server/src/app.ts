import express from "express";
import cors from "cors";
import moviesRoutes from "./routes/movies.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "PERN TMDB API Running 🚀" });
});

app.use("/api/movies", moviesRoutes);

app.get("/favicon.ico", (req, res) => res.status(204).end());

export default app;
