require("dotenv").config();
const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function main() {
  console.log("Connecting to database...");
  await client.connect();

  console.log("Creating messages table...");
  await client.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      text TEXT NOT NULL,
      username VARCHAR(100) NOT NULL,
      added TIMESTAMP DEFAULT NOW()
    );
  `);

  console.log("Checking for existing data...");
  const { rows } = await client.query("SELECT COUNT(*) FROM messages");
  const count = parseInt(rows[0].count);

  if (count === 0) {
    console.log("Seeding sample messages...");
    await client.query(`
      INSERT INTO messages (text, username) VALUES
      ('Hi there!', 'Amando'),
      ('Hello World!', 'Charles');
    `);
    console.log("Sample messages inserted.");
  } else {
    console.log("Table already has data, skipping seed.");
  }

  await client.end();
  console.log("Done.");
}

main().catch((err) => {
  console.error("Error running database script:", err);
  client.end();
  process.exit(1);
});