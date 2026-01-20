import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PokemonCard from './index';
import { FavoritesProvider } from '../../../../context/FavoritesContext';
import { AuthProvider } from '../../../../context/AuthContext';
import type { PokemonDetail } from '../../../../types/pokemon';

const mockPokemon: PokemonDetail = {
    id: 1,
    name: 'bulbasaur',
    types: [{ type: { name: 'grass', url: '' }, slot: 1 }],
    sprites: {
        front_default: 'front.png',
        other: {
            'official-artwork': {
                front_default: 'artwork.png'
            }
        }
    },
    height: 7,
    weight: 69,
    abilities: [],
    moves: [],
    stats: [],
};

describe('PokemonCard', () => {
    it('should render pokemon details correctly', () => {
        render(
            <AuthProvider>
                <FavoritesProvider>
                    <PokemonCard pokemon={mockPokemon} />
                </FavoritesProvider>
            </AuthProvider>
        );

        expect(screen.getByText('bulbasaur')).toBeInTheDocument();
        expect(screen.getByText('#001')).toBeInTheDocument();
        expect(screen.getByText('grass')).toBeInTheDocument();

        const image = screen.getByRole('img', { hidden: true });
        fireEvent.load(image);

        expect(image).toHaveAttribute('src', 'artwork.png');
        expect(image).toHaveAttribute('alt', 'bulbasaur');
        expect(image).toBeVisible();
    });
});
