import { Pool } from "pg";

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

const connectionString: string = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?options=project%3D${ENDPOINT_ID}`;

const pool: Pool = new Pool({
	connectionString,
	ssl: { rejectUnauthorized: false },
});

export default pool;
