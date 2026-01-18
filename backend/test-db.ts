import mysql from 'mysql2/promise';
import 'dotenv/config';

async function test() {
    try {
        const dbUrl = process.env.DATABASE_URL;
        if (!dbUrl) {
            throw new Error('DATABASE_URL environment variable is not defined');
        }
        console.log('Connecting to:', dbUrl);
        const pool = mysql.createPool(dbUrl);
        const connection = await pool.getConnection();
        console.log('Connected via pool!');
        connection.release();
        await pool.end();
    } catch (error) {
        console.error('Connection failed:', error);
    }
}

test();
