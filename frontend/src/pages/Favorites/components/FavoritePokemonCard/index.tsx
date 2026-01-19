import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Chip, Skeleton } from '@mui/material';
import type { PokemonDetail } from '../../../../types/pokemon';
import { typeColors } from '../../../../theme/theme';
import './styles.css';

interface FavoritePokemonCardProps {
    pokemon: PokemonDetail;
}

const FavoritePokemonCard: React.FC<FavoritePokemonCardProps> = ({ pokemon }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const mainType = pokemon.types[0]?.type.name || 'normal';
    const backgroundColor = typeColors[mainType] || '#A8A77A';

    // Limit moves to first 8 for display
    const displayMoves = pokemon.moves.slice(0, 8);

    return (
        <Card
            className="favorite-pokemon-card"
            style={{
                background: `linear-gradient(135deg, ${backgroundColor}20 0%, ${backgroundColor}10 100%)`,
            }}
        >
            <Box className="favorite-pokemon-card-image-container">
                {!imageLoaded && (
                    <Skeleton variant="rectangular" width={150} height={150} className="favorite-pokemon-skeleton" />
                )}
                <CardMedia
                    component="img"
                    image={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default}
                    alt={pokemon.name}
                    className="favorite-pokemon-image"
                    onLoad={() => setImageLoaded(true)}
                    style={{ display: imageLoaded ? 'block' : 'none' }}
                />
            </Box>

            <CardContent className="favorite-pokemon-card-content">
                <Box className="favorite-pokemon-header">
                    <Typography variant="h5" component="div" className="favorite-pokemon-name">
                        {pokemon.name}
                    </Typography>
                    <Typography variant="caption" className="favorite-pokemon-id">
                        #{pokemon.id.toString().padStart(3, '0')}
                    </Typography>
                </Box>

                <Box className="favorite-pokemon-types">
                    {pokemon.types.map((type) => (
                        <Chip
                            key={type.type.name}
                            label={type.type.name}
                            size="small"
                            className="favorite-pokemon-type-chip"
                            style={{
                                backgroundColor: typeColors[type.type.name] || '#A8A77A',
                                color: 'white'
                            }}
                        />
                    ))}
                </Box>

                <Box className="favorite-pokemon-stats">
                    <Typography variant="body2" color="text.secondary">
                        <strong>Height:</strong> {pokemon.height / 10}m | <strong>Weight:</strong> {pokemon.weight / 10}kg
                    </Typography>
                </Box>

                <Box className="favorite-pokemon-abilities">
                    <Typography variant="body2" color="text.secondary">
                        <strong>Abilities:</strong> {pokemon.abilities.map(a => a.ability.name).join(', ')}
                    </Typography>
                </Box>

                {displayMoves.length > 0 && (
                    <Box className="favorite-pokemon-moves">
                        <Typography variant="body2" color="text.secondary">
                            <strong>Moves:</strong> {displayMoves.map(m => m.move.name).join(', ')}
                            {pokemon.moves.length > 8 && ` (+${pokemon.moves.length - 8} more)`}
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default FavoritePokemonCard;
