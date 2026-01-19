import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import FavoritePokemonCard from './components/FavoritePokemonCard';
import FavoritePokemonCardSkeleton from './components/FavoritePokemonCardSkeleton';
import { useFavorites } from '../../hooks/useFavorites';
import './styles.css';

const Favorites: React.FC = () => {
    const { favorites, loading, error } = useFavorites();

    if (error) {
        return (
            <Box className="favorites-error-container">
                <Typography color="error" variant="h6">{error}</Typography>
            </Box>
        );
    }

    if (!loading && favorites.length === 0) {
        return (
            <Container maxWidth={false} sx={{ maxWidth: '800px', width: '100%', mx: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }} className="favorites-container">
                <Typography variant="h3" component="h1" gutterBottom className="favorites-title">
                    My Favorites
                </Typography>
                <Box className="favorites-empty-state">
                    <Typography variant="h5" color="text.secondary">
                        No favorites yet
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                        Click the heart icon on any Pokemon card to add it to your favorites!
                    </Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth={false} sx={{ maxWidth: '900px', width: '100%', mx: 'auto' }} className="favorites-container">
            <Typography variant="h3" component="h1" gutterBottom className="favorites-title">
                My Favorites
            </Typography>
            <Box className="favorites-list">
                {loading ? (
                    Array.from(new Array(4)).map((_, index) => (
                        <FavoritePokemonCardSkeleton key={index} />
                    ))
                ) : (
                    favorites.map((pokemon) => (
                        <FavoritePokemonCard key={pokemon.id} pokemon={pokemon} />
                    ))
                )}
            </Box>
        </Container>
    );
};

export default Favorites;
