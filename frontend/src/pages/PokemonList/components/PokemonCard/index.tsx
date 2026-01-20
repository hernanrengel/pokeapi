import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Chip, Skeleton, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useFavorites } from '../../../../context/FavoritesContext';
import { useAuth } from '../../../../context/AuthContext';
import type { PokemonDetail } from '../../../../types/pokemon';
import { typeColors } from '../../../../theme/theme';
import './styles.css';


interface PokemonCardProps {
    pokemon: PokemonDetail;
    onClick?: (pokemon: PokemonDetail) => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onClick }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const mainType = pokemon.types[0]?.type.name || 'normal';
    const backgroundColor = typeColors[mainType] || '#A8A77A';

    const { isAuthenticated } = useAuth();
    const { favorites, toggleFavorite } = useFavorites();
    const isFavorite = favorites.includes(pokemon.id);

    const handleCardClick = () => {
        if (onClick) {
            onClick(pokemon);
        }
    };

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click when clicking favorite
        toggleFavorite(pokemon.id);
    };

    return (
        <Card
            className={`pokemon-card ${onClick ? 'pokemon-card-clickable' : ''}`}
            onClick={handleCardClick}
            style={{
                background: `linear-gradient(135deg, ${backgroundColor} 0%, ${backgroundColor}aa 100%)`,
            }}
        >
            <Box className="pokemon-card-image-container">
                {!imageLoaded && (
                    <Skeleton variant="rectangular" width={120} height={120} style={{ borderRadius: '50%' }} />
                )}
                <CardMedia
                    component="img"
                    image={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default}
                    alt={pokemon.name}
                    className="pokemon-card-image"
                    onLoad={() => setImageLoaded(true)}
                    style={{ display: imageLoaded ? 'block' : 'none' }}
                />
            </Box>

            <CardContent className="pokemon-card-content">
                <Typography variant="caption" className="pokemon-id">
                    #{pokemon.id.toString().padStart(3, '0')}
                </Typography>
                <Typography gutterBottom variant="h5" component="div" className="pokemon-name">
                    {pokemon.name}
                </Typography>

                <Box className="pokemon-types">
                    {pokemon.types.map((type) => (
                        <Chip
                            key={type.type.name}
                            label={type.type.name}
                            size="small"
                            className="pokemon-type-chip"
                        />
                    ))}
                </Box>
                {isAuthenticated && (
                    <IconButton
                        onClick={handleFavoriteClick}
                        className="favorite-button"
                    >
                        {isFavorite ? (
                            <FavoriteIcon sx={{ color: '#e91e63', fontSize: 28 }} />
                        ) : (
                            <FavoriteBorderIcon sx={{ color: '#666', fontSize: 28 }} />
                        )}
                    </IconButton>
                )}
            </CardContent>
        </Card>
    );
};

export default PokemonCard;
