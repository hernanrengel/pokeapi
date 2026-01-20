import axios from 'axios';
import type { PokemonListResponse, PokemonDetail } from '../types/pokeApi.types.js';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

export class PokeApiService {
    /**
     * Fetches a list of Pokémon with pagination.
     * @param limit Number of results to return (default 20)
     * @param offset Offset for pagination (default 0)
     * @returns Promise<PokemonListResponse>
     */
    static async getPokemonList(limit: number = 20, offset: number = 0): Promise<PokemonListResponse> {
        try {
            const response = await axios.get<PokemonListResponse>(`${POKEAPI_BASE_URL}/pokemon`, {
                params: {
                    limit,
                    offset,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching Pokémon list:', error);
            throw new Error('Failed to fetch Pokémon list from PokeAPI');
        }
    }

    /**
     * Fetches details for a specific Pokémon by name or ID.
     * @param nameOrId Pokémon name or ID
     * @returns Promise<PokemonDetail>
     */
    static async getPokemonDetail(nameOrId: string | number): Promise<PokemonDetail> {
        try {
            const response = await axios.get<PokemonDetail>(`${POKEAPI_BASE_URL}/pokemon/${nameOrId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching Pokémon detail for ${nameOrId}:`, error);
            throw new Error(`Failed to fetch Pokémon detail for ${nameOrId}`);
        }
    }

    /**
     * Searches Pokémon by ability name.
     * @param abilityName Name of the ability
     * @returns Promise<PokemonDetail[]>
     */
    static async searchByAbility(abilityName: string): Promise<PokemonDetail[]> {
        try {
            const response = await axios.get(`${POKEAPI_BASE_URL}/ability/${abilityName}`);
            const pokemonList = response.data.pokemon || [];

            // Fetch details for each Pokemon (limit to first 50 for performance)
            const detailPromises = pokemonList.slice(0, 50).map((p: any) =>
                this.getPokemonDetail(p.pokemon.name)
            );

            return await Promise.all(detailPromises);
        } catch (error) {
            console.error(`Error searching by ability ${abilityName}:`, error);
            throw new Error(`Failed to search by ability ${abilityName}`);
        }
    }

    /**
     * Searches Pokémon by type name.
     * @param typeName Name of the type (e.g., fire, water)
     * @returns Promise<PokemonDetail[]>
     */
    static async searchByType(typeName: string): Promise<PokemonDetail[]> {
        try {
            const response = await axios.get(`${POKEAPI_BASE_URL}/type/${typeName}`);
            const pokemonList = response.data.pokemon || [];

            // Fetch details for each Pokemon (limit to first 50 for performance)
            const detailPromises = pokemonList.slice(0, 50).map((p: any) =>
                this.getPokemonDetail(p.pokemon.name)
            );

            return await Promise.all(detailPromises);
        } catch (error) {
            console.error(`Error searching by type ${typeName}:`, error);
            throw new Error(`Failed to search by type ${typeName}`);
        }
    }
}
