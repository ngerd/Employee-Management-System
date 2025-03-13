import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  // user: "postgres",
  // host: "34.81.89.236",
  // database: "postgres",
  // password: "cuoi08",
  // port: 5432


  user: "employeemanagement",
  host: "dpg-cv8kh5dumphs73cptj4g-a.singapore-postgres.render.com",
  database: "employeemanagement_uhfq",
  password: "WsEylr9iInxF5CdS027LZGEnn2zf8BzP",
  port: 5432,
  ssl: { rejectUnauthorized: false }
});
pool.connect();

export default pool;
