import { useState, useEffect } from 'react';
import axios from 'axios';
import type { PokemonListResponse, PokemonDetail } from '../types/pokemon';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const usePokemonList = (limit: number = 20) => {
    const [pokemonList, setPokemonList] = useState<PokemonDetail[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);

    useEffect(() => {
        const fetchPokemonList = async () => {
            try {
                setLoading(true);
                setError(null);

                const offset = (page - 1) * limit;

                const listResponse = await axios.get<PokemonListResponse>(`${API_URL}/pokemon`, {
                    params: { limit, offset }
                });

                setTotalPages(Math.ceil(listResponse.data.count / limit));

                const detailPromises = listResponse.data.results.map(async (p) => {
                    const detailResponse = await axios.get<PokemonDetail>(`${API_URL}/pokemon/${p.name}`);
                    return detailResponse.data;
                });

                const details = await Promise.all(detailPromises);
                setPokemonList(details);
            } catch (err) {
                console.error(err);
                setError('Failed to load Pokémon. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchPokemonList();
    }, [limit, page]);

    return { pokemonList, loading, error, page, setPage, totalPages };
};
