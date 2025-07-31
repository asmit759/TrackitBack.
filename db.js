import pg from 'pg';
const Pool = pg.Pool;

const pool = new Pool({
    user: "postgres",
    password: "ASMIT@2231",
    host: "localhost",
    port: 5432,
    database: "lostandfound"
});

export default pool;