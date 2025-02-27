import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "34.81.89.236",
  database: "postgres",
  password: "cuoi08",
  port: 5432
});
pool.connect();

export default pool;
