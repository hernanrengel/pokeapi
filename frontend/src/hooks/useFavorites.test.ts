import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFavorites } from './useFavorites';
import axios from 'axios';

vi.mock('axios');
import { type Mocked } from 'vitest';
const mockedAxios = axios as Mocked<typeof axios>;

describe('useFavorites', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch and return favorites list', async () => {
        const mockFavoritesResponse = {
            data: [
                { id: 'uuid-1', pokemonId: 1, createdAt: new Date() },
                { id: 'uuid-2', pokemonId: 25, createdAt: new Date() }
            ]
        };

        const mockPokemonDetails = [
            {
                data: {
                    id: 1,
                    name: 'bulbasaur',
                    types: [],
                    sprites: {}
                }
            },
            {
                data: {
                    id: 25,
                    name: 'pikachu',
                    types: [],
                    sprites: {}
                }
            }
        ];

        mockedAxios.get.mockImplementation((url: string) => {
            if (url.includes('/favorites')) {
                return Promise.resolve(mockFavoritesResponse);
            }
            if (url.includes('/pokemon/1')) {
                return Promise.resolve(mockPokemonDetails[0]);
            }
            if (url.includes('/pokemon/25')) {
                return Promise.resolve(mockPokemonDetails[1]);
            }
            return Promise.reject(new Error('Unknown URL'));
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

        mockedAxios.get.mockResolvedValue(mockEmptyResponse);

        const { result } = renderHook(() => useFavorites());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.favorites).toHaveLength(0);
        expect(result.current.error).toBe(null);
    });

    it('should handle errors', async () => {
        mockedAxios.get.mockRejectedValue(new Error('API Error'));

        const { result } = renderHook(() => useFavorites());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.error).toBe('Failed to load favorites. Please try again later.');
        expect(result.current.favorites).toHaveLength(0);
    });
});
