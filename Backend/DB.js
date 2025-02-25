import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "172.30.3.66",
  database: "postgres",
  password: "cuoi08",
  port: 5432,
});
pool.connect();

export default pool;
  