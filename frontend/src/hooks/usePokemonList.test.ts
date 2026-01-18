import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { usePokemonList } from './usePokemonList';
import axios from 'axios';

vi.mock('axios');
import { type Mocked } from 'vitest';
const mockedAxios = axios as Mocked<typeof axios>;

describe('usePokemonList', () => {
    it('should fetch and return pokemon list', async () => {
        const mockListResponse = {
            data: {
                count: 100,
                results: [{ name: 'bulbasaur', url: 'url' }]
            }
        };
        const mockDetailResponse = {
            data: {
                id: 1,
                name: 'bulbasaur',
                types: [],
                sprites: {}
            }
        };

        mockedAxios.get.mockImplementation((url: string) => {
            if (url.includes('/pokemon/bulbasaur')) {
                return Promise.resolve(mockDetailResponse);
            }
            return Promise.resolve(mockListResponse);
        });

        const { result } = renderHook(() => usePokemonList());

        expect(result.current.loading).toBe(true);

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        }, { timeout: 2000 }); // Increased timeout for artificial delay

        expect(result.current.pokemonList).toHaveLength(1);
        expect(result.current.pokemonList[0].name).toBe('bulbasaur');
    });

    it('should handle errors', async () => {
        mockedAxios.get.mockRejectedValue(new Error('API Error'));

        const { result } = renderHook(() => usePokemonList());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        }, { timeout: 2000 });

        expect(result.current.error).toBe('Failed to load Pokémon. Please try again later.');
    });
});
