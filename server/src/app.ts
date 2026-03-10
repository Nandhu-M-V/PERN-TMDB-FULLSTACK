import express from "express";
import cors from "cors";
import mainRoutes from "./routes/media.routes.js";
import authRoutes from "./routes/auth.routes.ts";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "PERN TMDB API Running 🚀" });
});

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api", mainRoutes);

app.use("/auth", authRoutes);

app.get("/favicon.ico", (req, res) => res.status(204).end());

export default app;
