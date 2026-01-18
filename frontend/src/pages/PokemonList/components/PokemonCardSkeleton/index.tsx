import React from 'react';
import { Card, CardContent, Box, Skeleton } from '@mui/material';
import '../PokemonCard/styles.css';

const PokemonCardSkeleton: React.FC = () => {
    return (
        <Card className="pokemon-card" style={{ background: '#f5f5f5' }}>
            <Box className="pokemon-card-image-container">
                <Skeleton variant="rectangular" width={120} height={120} style={{ borderRadius: '50%' }} />
            </Box>

            <CardContent className="pokemon-card-content">
                <Box display="flex" justifyContent="center" mb={1}>
                    <Skeleton variant="text" width={40} height={20} />
                </Box>
                <Box display="flex" justifyContent="center" mb={2}>
                    <Skeleton variant="text" width={100} height={32} />
                </Box>

                <Box className="pokemon-types">
                    <Skeleton variant="rounded" width={60} height={24} />
                    <Skeleton variant="rounded" width={60} height={24} />
                </Box>
            </CardContent>
        </Card>
    );
};

export default PokemonCardSkeleton;
