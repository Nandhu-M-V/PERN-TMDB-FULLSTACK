import dotenv from "dotenv";
import initDb from "./config/initDb.js";
import { createTables } from "./config/schema.js";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const start = async () => {
  await initDb();       
  await createTables(); 

  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
};

start();