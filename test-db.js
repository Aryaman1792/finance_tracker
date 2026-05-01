const { Client } = require('pg');
const client = new Client({
  user: 'aryamanchaliha',
  host: 'localhost',
  port: 5432,
  database: 'postgres'
});
client.connect()
  .then(() => { console.log('Connected to pg as aryamanchaliha!'); process.exit(0); })
  .catch(err => { console.error('Connection error', err.stack); process.exit(1); });
