import { jest, describe, it, expect, afterEach, beforeAll } from '@jest/globals';

// Mock axios before importing the service
jest.unstable_mockModule('axios', () => ({
    default: {
        get: jest.fn(),
    },
}));

// Import service and axios after mocking
const { PokeApiService } = await import('./pokeApi.service.js');
const { default: axios } = await import('axios');
const mockedAxios = axios as unknown as { get: ReturnType<typeof jest.fn> };

describe('PokeApi Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getPokemonList', () => {
        it('should return a list of pokemon', async () => {
            const mockResponse = {
                data: {
                    count: 100,
                    next: 'next-url',
                    previous: null,
                    results: [{ name: 'bulbasaur', url: 'url' }]
                }
            };
            mockedAxios.get.mockResolvedValue(mockResponse);

            const result = await PokeApiService.getPokemonList(20, 0);

            expect(mockedAxios.get).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon', {
                params: { limit: 20, offset: 0 }
            });
            expect(result).toEqual(mockResponse.data);
        });

        it('should throw an error if api call fails', async () => {
            mockedAxios.get.mockRejectedValue(new Error('API Error'));

            await expect(PokeApiService.getPokemonList()).rejects.toThrow('Failed to fetch Pokémon list from PokeAPI');
        });
    });

    describe('getPokemonDetail', () => {
        it('should return pokemon details', async () => {
            const mockResponse = {
                data: {
                    id: 1,
                    name: 'bulbasaur',
                    types: [],
                    sprites: {}
                }
            };
            mockedAxios.get.mockResolvedValue(mockResponse);

            const result = await PokeApiService.getPokemonDetail('bulbasaur');

            expect(mockedAxios.get).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/bulbasaur');
            expect(result).toEqual(mockResponse.data);
        });
    });
});
