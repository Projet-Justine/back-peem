const { Client } = require('pg');

async function main() {
  const c = new Client({
    user: 'postgres',
    password: 'hackermode',
    database: 'plateforme',
    port: 5432,
    host: 'localhost',
  });
  await c.connect();
  const res = await c.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name");
  console.log('Tables found (' + res.rows.length + '):');
  console.log(res.rows.map(r => r.table_name).join(', '));
  await c.end();
}

main().catch(console.error);
