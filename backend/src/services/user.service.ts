import mysql from 'mysql2/promise';

const connectionString = process.env.DATABASE_URL || '';
const pool = mysql.createPool(connectionString);

interface CreateUserData {
    email: string;
    password: string;
    name?: string;
}

interface User {
    id: string;
    email: string;
    password: string;
    name: string | null;
    createdAt: Date;
}

export class UserService {
    /**
     * Get user by ID
     */
    static async getUserById(id: string): Promise<User | null> {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE id = ?',
            [id]
        );

        if (!Array.isArray(rows) || rows.length === 0) {
            return null;
        }

        return rows[0] as User;
    }

    /**
     * Get user by email
     */
    static async getUserByEmail(email: string): Promise<User | null> {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (!Array.isArray(rows) || rows.length === 0) {
            return null;
        }

        return rows[0] as User;
    }

    /**
     * Create a new user
     */
    static async createUser(data: CreateUserData): Promise<User> {
        const { randomUUID } = await import('crypto');
        const id = randomUUID();

        await pool.execute(
            'INSERT INTO users (id, email, password, name, createdAt) VALUES (?, ?, ?, ?, NOW())',
            [id, data.email, data.password, data.name || null]
        );

        const user = await this.getUserById(id);
        if (!user) {
            throw new Error('Failed to create user');
        }

        return user;
    }
}
