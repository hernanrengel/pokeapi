import React, { useState } from 'react';
import { Card, CardContent, Typography, Chip, Box, CircularProgress, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useFavorites } from '../../../../context/FavoritesContext';
import { useAuth } from '../../../../context/AuthContext';
import type { PokemonDetail } from '../../../../types/pokemon';
import { getPokemonTypeColor } from '../../../../theme/theme';
import pokemonPlaceholder from '../../../../assets/pokemon-placeholder.png';
import './styles.css';

interface PokemonCardProps {
    pokemon: PokemonDetail;
    onClick?: (pokemon: PokemonDetail) => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onClick }) => {
    const { isFavorite, toggleFavorite } = useFavorites();
    const { isAuthenticated } = useAuth();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const isFav = isFavorite(pokemon.id);
    const primaryType = pokemon.types[0]?.type.name || 'normal';
    const backgroundColor = getPokemonTypeColor(primaryType);

    const imageUrl = pokemon.sprites?.other?.['official-artwork']?.front_default || pokemonPlaceholder;

    const handleCardClick = () => {
        if (onClick) {
            onClick(pokemon);
        }
    };

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
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
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '240px' }}>
                        <CircularProgress sx={{ color: 'white' }} />
                    </Box>
                )}
                <img
                    src={imageUrl}
                    alt={pokemon.name}
                    className="pokemon-card-image"
                    onLoad={() => setImageLoaded(true)}
                    onError={(e) => {
                        if (!imageError) {
                            setImageError(true);
                            (e.target as HTMLImageElement).src = pokemonPlaceholder;
                        }
                    }}
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
                        {isFav ? (
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
