import pkg from "pg";
const { Client } = pkg;

const initDb = async () => {
  const dbName = process.env.DB_NAME;

  if (!dbName) {
    throw new Error("DB_NAME is not defined in .env");
  }

  const client = new Client({
    user: process.env.DB_USER,
    host: "localhost",
    database: "postgres",
    password: process.env.DB_PASSWORD,
    port: 5432,
  });

  await client.connect();

  const res = await client.query(
    `SELECT 1 FROM pg_database WHERE datname = $1`,
    [dbName]
  );

  if (res.rowCount === 0) {
    console.log(`Creating database: ${dbName} 🚀`);

    await client.query(`CREATE DATABASE "${dbName}"`);
  } else {
    console.log(`Database "${dbName}" already exists `);
  }

  await client.end();
};

export default initDb;