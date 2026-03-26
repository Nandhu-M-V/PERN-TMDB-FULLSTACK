import { pool } from "./db.js";

export const createTables = async () => {
  await pool.query(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE 'plpgsql';
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS movies (
      id SERIAL PRIMARY KEY,
      tmdb_id INTEGER UNIQUE,

      title TEXT NOT NULL,
      overview TEXT,
      tagline TEXT,

      poster_path TEXT,
      backdrop_path TEXT,

      release_date DATE,
      runtime INTEGER,

      popularity REAL,
      vote_average REAL,
      vote_count INTEGER,

      adult BOOLEAN DEFAULT FALSE,
      status TEXT,
      original_language TEXT,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tvshows (
      id SERIAL PRIMARY KEY,
      tmdb_id INTEGER UNIQUE,

      name TEXT NOT NULL,
      overview TEXT,
      tagline TEXT,

      poster_path TEXT,
      backdrop_path TEXT,

      first_air_date DATE,
      last_air_date DATE,

      number_of_seasons INTEGER,
      number_of_episodes INTEGER,

      popularity REAL,
      vote_average REAL,
      vote_count INTEGER,

      adult BOOLEAN DEFAULT FALSE,
      status TEXT,
      original_language TEXT,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id SERIAL PRIMARY KEY,

      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,

      token TEXT NOT NULL,
      expires_at TIMESTAMP NOT NULL,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_movies_tmdb_id ON movies(tmdb_id);
    CREATE INDEX IF NOT EXISTS idx_movies_popularity ON movies(popularity);

    CREATE INDEX IF NOT EXISTS idx_tv_tmdb_id ON tvshows(tmdb_id);
    CREATE INDEX IF NOT EXISTS idx_tv_popularity ON tvshows(popularity);

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  `);

  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_movies_updated_at'
      ) THEN
        CREATE TRIGGER update_movies_updated_at
        BEFORE UPDATE ON movies
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_tvshows_updated_at'
      ) THEN
        CREATE TRIGGER update_tvshows_updated_at
        BEFORE UPDATE ON tvshows
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
      END IF;
    END
    $$;
  `);

  console.log("All tables ready ✅");
};