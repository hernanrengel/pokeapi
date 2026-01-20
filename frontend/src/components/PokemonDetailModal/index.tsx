import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Box,
    Typography,
    Chip,
    LinearProgress,
    Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { PokemonDetail } from '../../types/pokemon';
import { typeColors } from '../../theme/theme';
import './styles.css';

interface PokemonDetailModalProps {
    open: boolean;
    onClose: () => void;
    pokemon: PokemonDetail | null;
}

const PokemonDetailModal: React.FC<PokemonDetailModalProps> = ({ open, onClose, pokemon }) => {
    if (!pokemon) return null;

    const mainType = pokemon.types[0]?.type.name || 'normal';
    const backgroundColor = typeColors[mainType] || '#A8A77A';

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle className="pokemon-detail-header" style={{ background: `linear-gradient(135deg, ${backgroundColor} 0%, ${backgroundColor}aa 100%)` }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: '#fff', textTransform: 'capitalize' }}>
                            {pokemon.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                            #{pokemon.id.toString().padStart(3, '0')}
                        </Typography>
                    </Box>
                    <IconButton onClick={onClose} sx={{ color: '#fff' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ pt: 3 }}>
                <Grid container spacing={3}>
                    {/* Left Column - Image */}
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Box className="pokemon-detail-image-container">
                            <img
                                src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default}
                                alt={pokemon.name}
                                className="pokemon-detail-image"
                            />
                        </Box>
                    </Grid>

                    {/* Right Column - Details */}
                    <Grid size={{ xs: 12, md: 7 }}>
                        {/* Types */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#666' }}>
                                TYPE
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                {pokemon.types.map((type) => (
                                    <Chip
                                        key={type.type.name}
                                        label={type.type.name}
                                        sx={{
                                            background: typeColors[type.type.name] || '#A8A77A',
                                            color: '#fff',
                                            fontWeight: 600,
                                            textTransform: 'capitalize',
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>

                        {/* Physical Stats */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#666' }}>
                                PHYSICAL
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 6 }}>
                                    <Box className="stat-box">
                                        <Typography variant="body2" color="text.secondary">Height</Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>{pokemon.height / 10} m</Typography>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <Box className="stat-box">
                                        <Typography variant="body2" color="text.secondary">Weight</Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>{pokemon.weight / 10} kg</Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Abilities */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#666' }}>
                                ABILITIES
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {pokemon.abilities.map((ability) => (
                                    <Chip
                                        key={ability.ability.name}
                                        label={ability.ability.name}
                                        size="small"
                                        variant={ability.is_hidden ? 'outlined' : 'filled'}
                                        sx={{
                                            textTransform: 'capitalize',
                                            fontWeight: 500,
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>

                        {/* Base Stats */}
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#666' }}>
                                BASE STATS
                            </Typography>
                            {pokemon.stats.map((stat) => (
                                <Box key={stat.stat.name} sx={{ mb: 1.5 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="body2" sx={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600 }}>
                                            {stat.stat.name.replace('-', ' ')}
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                            {stat.base_stat}
                                        </Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={(stat.base_stat / 255) * 100}
                                        sx={{
                                            height: 8,
                                            borderRadius: 4,
                                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                            '& .MuiLinearProgress-bar': {
                                                background: `linear-gradient(90deg, ${backgroundColor}, ${backgroundColor}cc)`,
                                                borderRadius: 4,
                                            },
                                        }}
                                    />
                                </Box>
                            ))}
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

export default PokemonDetailModal;
