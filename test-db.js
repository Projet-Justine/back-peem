const { Client } = require('pg');

async function initDb() {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'hackermode',
    port: 5432,
  });

  try {
    await client.connect();
    console.log('Successfully connected to PostgreSQL!');
    const checkDb = await client.query("SELECT 1 FROM pg_database WHERE datname = 'plateforme'");
    if (checkDb.rows.length === 0) {
      await client.query('CREATE DATABASE plateforme');
      console.log('Database "plateforme" created successfully!');
    } else {
      console.log('Database "plateforme" already exists.');
    }
  } catch (err) {
    console.error('Database connection error:', err.message);
  } finally {
    await client.end();
  }
}

initDb();
