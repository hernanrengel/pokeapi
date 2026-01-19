import mysql from 'mysql2/promise';
import { randomUUID } from 'crypto';

const connectionString = process.env.DATABASE_URL || '';
console.log('FavoritesService initializing with DB URL:', connectionString);

const pool = mysql.createPool(connectionString);

export class FavoritesService {
    static async addFavorite(pokemonId: number, userId: string) {
        const id = randomUUID();

        const [result] = await pool.execute(
            'INSERT INTO favorites (id, pokemonId, userId, createdAt) VALUES (?, ?, ?, NOW())',
            [id, pokemonId, userId]
        );

        return { id, pokemonId, userId, createdAt: new Date() };
    }

    static async removeFavorite(pokemonId: number, userId: string) {
        await pool.execute(
            'DELETE FROM favorites WHERE pokemonId = ? AND userId = ?',
            [pokemonId, userId]
        );

        return { success: true };
    }

    static async getFavorites(userId: string) {
        const [rows] = await pool.execute(
            'SELECT * FROM favorites WHERE userId = ? ORDER BY createdAt DESC',
            [userId]
        );

        if (!Array.isArray(rows)) {
            return [];
        }

        return rows as Array<{ id: string; pokemonId: number; userId: string; createdAt: Date }>;
    }

    static async getFavoriteById(id: string, userId: string) {
        const [rows] = await pool.execute(
            'SELECT * FROM favorites WHERE id = ? AND userId = ?',
            [id, userId]
        );

        if (!Array.isArray(rows) || rows.length === 0) {
            return null;
        }

        return rows[0] as { id: string; pokemonId: number; userId: string; createdAt: Date };
    }
}
