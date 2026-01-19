import { useState, useEffect } from 'react';
import axios from 'axios';
import type { PokemonDetail } from '../types/pokemon';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

interface FavoriteResponse {
    id: string;
    pokemonId: number;
    createdAt: Date;
    pokemon: PokemonDetail;
}

export const useFavorites = () => {
    const [favorites, setFavorites] = useState<PokemonDetail[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                setLoading(true);
                setError(null);

                const favoritesResponse = await axios.get<FavoriteResponse[]>(`${API_BASE_URL}/favorites`);

                if (favoritesResponse.data.length === 0) {
                    setFavorites([]);
                    setLoading(false);
                    return;
                }

                const detailPromises = favoritesResponse.data.map(async (fav) => {
                    const detailResponse = await axios.get<FavoriteResponse>(`${API_BASE_URL}/favorites/${fav.id}`);
                    return detailResponse.data.pokemon;
                });

                const details = await Promise.all(detailPromises);
                setFavorites(details);
            } catch (err) {
                console.error(err);
                setError('Failed to load favorites. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    return { favorites, loading, error };
};
