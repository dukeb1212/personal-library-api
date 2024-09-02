const { Pool } = require('pg');
require('dotenv').config();  // Ensure this is included to load your environment variables

// Database PostgreSQL information
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
});

(async () => {
    try {
        // Connect to the database
        const client = await pool.connect();
        console.log('Connected to the database successfully!');

        // Optionally, run a simple query to test it further
        const res = await client.query('SELECT NOW()');
        console.log('Database time:', res.rows[0].now);

        // Release the client back to the pool
        client.release();
    } catch (error) {
        console.error('Error connecting to the database:', error);
    } finally {
        // End the pool to exit the script
        await pool.end();
    }
})();
