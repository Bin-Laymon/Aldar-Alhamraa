const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

async function run() {
  const dir = path.join(process.cwd(), 'database/seeds');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(dir, file), 'utf-8');
    process.stdout.write(`Running seed: ${file}\n`);
    await pool.query(sql);
  }

  await pool.end();
  process.stdout.write('Seed complete.\n');
}

run().catch(async (err) => {
  console.error(err);
  await pool.end();
  process.exit(1);
});
