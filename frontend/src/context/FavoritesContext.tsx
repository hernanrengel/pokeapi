import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import { Snackbar, Alert, Backdrop, CircularProgress } from '@mui/material';

// Types
interface FavoritesContextType {
    favorites: number[];
    toggleFavorite: (id: number) => Promise<void>;
}

interface FavoriteResponse {
    pokemonId: number;
}

// Constants
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const TOAST_DURATION = 3000;
const TOAST_MESSAGES = {
    ADDED: 'Pokemon saved to favorites',
    REMOVED: 'Pokemon removed from favorites',
    ERROR: 'Error updating favorites',
} as const;

// Context
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// API Service
const favoritesApi = {
    async fetchAll(): Promise<number[]> {
        const response = await fetch(`${API_BASE_URL}/favorites`);
        const data: FavoriteResponse[] = await response.json();
        return data.map((fav) => fav.pokemonId);
    },

    async add(pokemonId: number): Promise<void> {
        await fetch(`${API_BASE_URL}/favorites`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pokemonId }),
        });
    },

    async remove(pokemonId: number): Promise<void> {
        await fetch(`${API_BASE_URL}/favorites/${pokemonId}`, {
            method: 'DELETE',
        });
    },
};

// Provider Component
export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [favorites, setFavorites] = useState<number[]>([]);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            const pokemonIds = await favoritesApi.fetchAll();
            setFavorites(pokemonIds);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        }
    };

    const showToast = (message: string) => {
        setToastMessage(message);
        setToastOpen(true);
    };

    const toggleFavorite = async (pokemonId: number) => {
        const isFavorite = favorites.includes(pokemonId);

        setLoading(true);
        try {
            if (isFavorite) {
                await favoritesApi.remove(pokemonId);
                setFavorites((prev) => prev.filter((id) => id !== pokemonId));
                showToast(TOAST_MESSAGES.REMOVED);
            } else {
                await favoritesApi.add(pokemonId);
                setFavorites((prev) => [...prev, pokemonId]);
                showToast(TOAST_MESSAGES.ADDED);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            showToast(TOAST_MESSAGES.ERROR);
        } finally {
            setLoading(false);
        }
    };

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
            {children}
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Snackbar
                open={toastOpen}
                autoHideDuration={TOAST_DURATION}
                onClose={() => setToastOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={() => setToastOpen(false)} severity="success" sx={{ width: '100%' }}>
                    {toastMessage}
                </Alert>
            </Snackbar>
        </FavoritesContext.Provider>
    );
};

// Custom Hook
export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};
