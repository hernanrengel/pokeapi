import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFavorites } from './useFavorites';

// Create stable mock objects

const mockFavoritesArray: number[] = [];
const mockIsFavorite = vi.fn();
const mockToggleFavorite = vi.fn();

const mockFavoritesContext = {
    favorites: mockFavoritesArray,
    isFavorite: mockIsFavorite,
    toggleFavorite: mockToggleFavorite,
};

// Mock the api module
vi.mock('../services/api', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        delete: vi.fn(),
    }
}));

// Mock the AuthContext with a controllable mock function
const mockUseAuth = vi.fn();
vi.mock('../context/AuthContext', () => ({
    useAuth: () => mockUseAuth()
}));

// Mock the FavoritesContext - renamed to avoid collision
vi.mock('../context/FavoritesContext', () => ({
    useFavorites: vi.fn(() => mockFavoritesContext)
}));

import apiClient from '../services/api';

const mockedApiClient = apiClient as any;

describe('useFavorites', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default: authenticated user
        mockUseAuth.mockReturnValue({
            user: { id: '1', email: 'test@example.com', name: 'Test User' },
            isAuthenticated: true,
            loading: false,
            login: vi.fn(),
            register: vi.fn(),
            logout: vi.fn(),
        });
    });

    it('should fetch and return favorites list', async () => {
        const mockFavoritesResponse = {
            data: [
                {
                    id: 'uuid-1',
                    pokemonId: 1,
                    createdAt: new Date(),
                    pokemon: {
                        id: 1,
                        name: 'bulbasaur',
                        types: [],
                        sprites: {}
                    }
                },
                {
                    id: 'uuid-2',
                    pokemonId: 25,
                    createdAt: new Date(),
                    pokemon: {
                        id: 25,
                        name: 'pikachu',
                        types: [],
                        sprites: {}
                    }
                }
            ]
        };

        const mockPokemonDetail1 = {
            data: {
                id: 'uuid-1',
                pokemonId: 1,
                createdAt: new Date(),
                pokemon: {
                    id: 1,
                    name: 'bulbasaur',
                    types: [],
                    sprites: {}
                }
            }
        };

        const mockPokemonDetail2 = {
            data: {
                id: 'uuid-2',
                pokemonId: 25,
                createdAt: new Date(),
                pokemon: {
                    id: 25,
                    name: 'pikachu',
                    types: [],
                    sprites: {}
                }
            }
        };

        mockedApiClient.get.mockImplementation((url: string) => {
            if (url === '/favorites') {
                return Promise.resolve(mockFavoritesResponse);
            }
            if (url === '/favorites/uuid-1') {
                return Promise.resolve(mockPokemonDetail1);
            }
            if (url === '/favorites/uuid-2') {
                return Promise.resolve(mockPokemonDetail2);
            }
            return Promise.reject(new Error(`Unknown URL: ${url}`));
        });

        const { result } = renderHook(() => useFavorites());

        expect(result.current.loading).toBe(true);

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.favorites).toHaveLength(2);
        expect(result.current.favorites[0].name).toBe('bulbasaur');
        expect(result.current.favorites[1].name).toBe('pikachu');
        expect(result.current.error).toBe(null);
    });

    it('should return empty array when no favorites exist', async () => {
        const mockEmptyResponse = {
            data: []
        };

        mockedApiClient.get.mockResolvedValue(mockEmptyResponse);

        const { result } = renderHook(() => useFavorites());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.favorites).toHaveLength(0);
        expect(result.current.error).toBe(null);
    });

    it('should handle errors', async () => {
        mockedApiClient.get.mockRejectedValue(new Error('API Error'));

        const { result } = renderHook(() => useFavorites());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        }, { timeout: 3000 });

        expect(result.current.error).toBe('Failed to load favorites. Please try again later.');
        expect(result.current.favorites).toHaveLength(0);
    });

    it('should not fetch favorites when user is not authenticated', async () => {
        // Configure mock for unauthenticated user
        mockUseAuth.mockReturnValue({
            user: null,
            isAuthenticated: false,
            loading: false,
            login: vi.fn(),
            register: vi.fn(),
            logout: vi.fn(),
        });

        const { result } = renderHook(() => useFavorites());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.favorites).toHaveLength(0);
        expect(result.current.error).toBe(null);
        expect(mockedApiClient.get).not.toHaveBeenCalled();
    });
});
