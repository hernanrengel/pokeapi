import { useState, useEffect } from 'react';
import apiClient from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useFavorites as useFavoritesContext } from '../context/FavoritesContext';
import type { PokemonDetail } from '../types/pokemon';

interface FavoriteResponse {
    id: string;
    pokemonId: number;
    createdAt: Date;
    pokemon: PokemonDetail;
}

export const useFavorites = () => {
    const { isAuthenticated } = useAuth();
    const favoritesContext = useFavoritesContext();
    const [favorites, setFavorites] = useState<PokemonDetail[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFavorites = async () => {
            // Don't fetch if not authenticated
            if (!isAuthenticated) {
                setFavorites([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const favoritesResponse = await apiClient.get<FavoriteResponse[]>('/favorites');

                if (favoritesResponse.data.length === 0) {
                    setFavorites([]);
                    setLoading(false);
                    return;
                }

                const detailPromises = favoritesResponse.data.map(async (fav) => {
                    const detailResponse = await apiClient.get<FavoriteResponse>(`/favorites/${fav.id}`);
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
    }, [isAuthenticated, favoritesContext.favorites]);

    return { favorites, loading, error };
};
