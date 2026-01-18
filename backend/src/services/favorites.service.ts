import mysql from 'mysql2/promise';
import { randomUUID } from 'crypto';

const connectionString = process.env.DATABASE_URL || '';
console.log('FavoritesService initializing with DB URL:', connectionString);

const pool = mysql.createPool(connectionString);

export class FavoritesService {
    static async addFavorite(pokemonId: number) {
        const id = randomUUID();

        const [result] = await pool.execute(
            'INSERT INTO favorites (id, pokemonId, createdAt) VALUES (?, ?, NOW())',
            [id, pokemonId]
        );

        return { id, pokemonId, createdAt: new Date() };
    }

    static async removeFavorite(pokemonId: number) {
        await pool.execute(
            'DELETE FROM favorites WHERE pokemonId = ?',
            [pokemonId]
        );

        return { success: true };
    }

    static async getFavorites() {
        const [rows] = await pool.execute(
            'SELECT * FROM favorites ORDER BY createdAt DESC'
        );

        if (!Array.isArray(rows)) {
            return [];
        }

        return rows as Array<{ id: string; pokemonId: number; createdAt: Date }>;
    }
}
