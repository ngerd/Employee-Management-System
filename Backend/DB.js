import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "EmployeeManagement",
  password: "123456",
  port: 5432,
});
pool.connect();

export default pool;
  