import { useState } from 'react';
import apiClient from '../services/api';
import type { PokemonDetail } from '../types/pokemon';

interface UseSearchResult {
    searchPokemon: (name: string) => Promise<void>;
    results: PokemonDetail[];
    loading: boolean;
    error: string | null;
    clearError: () => void;
    clearResults: () => void;
}

export const useSearch = (): UseSearchResult => {
    const [results, setResults] = useState<PokemonDetail[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchPokemon = async (name: string) => {
        setLoading(true);
        setError(null);
        setResults([]);

        try {
            const response = await apiClient.get<PokemonDetail[]>(`/pokemon/search`, {
                params: { name: name.toLowerCase() },
            });
            setResults(response.data);
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || `No Pokemon found for "${name}"`;
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => setError(null);
    const clearResults = () => setResults([]);

    return {
        searchPokemon,
        results,
        loading,
        error,
        clearError,
        clearResults,
    };
};
