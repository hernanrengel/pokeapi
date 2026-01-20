import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Favorites from './index';
import * as useFavoritesHook from '../../hooks/useFavorites';
import { FavoritesProvider } from '../../context/FavoritesContext';
import { AuthProvider } from '../../context/AuthContext';
import type { PokemonDetail } from '../../types/pokemon';

vi.mock('../../hooks/useFavorites');

const mockPokemon: PokemonDetail[] = [
    {
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
        abilities: [
            { ability: { name: 'overgrow', url: '' }, is_hidden: false, slot: 1 }
        ],
        moves: [
            { move: { name: 'tackle', url: '' } },
            { move: { name: 'vine-whip', url: '' } }
        ],
        stats: [],
    },
    {
        id: 25,
        name: 'pikachu',
        types: [{ type: { name: 'electric', url: '' }, slot: 1 }],
        sprites: {
            front_default: 'front2.png',
            other: {
                'official-artwork': {
                    front_default: 'artwork2.png'
                }
            }
        },
        height: 4,
        weight: 60,
        abilities: [
            { ability: { name: 'static', url: '' }, is_hidden: false, slot: 1 }
        ],
        moves: [
            { move: { name: 'thunder-shock', url: '' } },
            { move: { name: 'quick-attack', url: '' } }
        ],
        stats: [],
    }
];

const renderWithProvider = (ui: React.ReactElement) => {
    return render(
        <AuthProvider>
            <FavoritesProvider>
                {ui}
            </FavoritesProvider>
        </AuthProvider>
    );
};

describe('Favorites', () => {
    it('should render favorites list correctly', () => {
        vi.spyOn(useFavoritesHook, 'useFavorites').mockReturnValue({
            favorites: mockPokemon,
            loading: false,
            error: null
        });

        renderWithProvider(<Favorites />);

        expect(screen.getByText('My Favorites')).toBeInTheDocument();
        expect(screen.getByText('bulbasaur')).toBeInTheDocument();
        expect(screen.getByText('pikachu')).toBeInTheDocument();
    });

    it('should render loading state', () => {
        vi.spyOn(useFavoritesHook, 'useFavorites').mockReturnValue({
            favorites: [],
            loading: true,
            error: null
        });

        renderWithProvider(<Favorites />);

        expect(screen.getByText('My Favorites')).toBeInTheDocument();
        // Should render 4 skeleton cards
        const skeletons = screen.getAllByTestId('favorite-pokemon-card-skeleton');
        expect(skeletons).toHaveLength(4);
    });

    it('should render empty state when no favorites exist', () => {
        vi.spyOn(useFavoritesHook, 'useFavorites').mockReturnValue({
            favorites: [],
            loading: false,
            error: null
        });

        renderWithProvider(<Favorites />);

        expect(screen.getByText('My Favorites')).toBeInTheDocument();
        expect(screen.getByText('No favorites yet')).toBeInTheDocument();
        expect(screen.getByText(/Click the heart icon/i)).toBeInTheDocument();
    });

    it('should render error state', () => {
        vi.spyOn(useFavoritesHook, 'useFavorites').mockReturnValue({
            favorites: [],
            loading: false,
            error: 'Failed to load favorites. Please try again later.'
        });

        renderWithProvider(<Favorites />);

        expect(screen.getByText('Failed to load favorites. Please try again later.')).toBeInTheDocument();
    });
});
