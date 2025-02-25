const {Pool} = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "172.30.3.66",
    database: "postgres",
    password: "cuoi08",
    port: 5432,
  });
pool.connect();

module.exports = pool;