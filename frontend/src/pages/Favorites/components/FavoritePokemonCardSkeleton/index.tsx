import React from 'react';
import { Card, Box, Skeleton } from '@mui/material';
import '../FavoritePokemonCard/styles.css';

const FavoritePokemonCardSkeleton: React.FC = () => {
    return (
        <Card className="favorite-pokemon-card" data-testid="favorite-pokemon-card-skeleton">
            <Box className="favorite-pokemon-card-image-container">
                <Skeleton variant="rectangular" width={150} height={150} className="favorite-pokemon-skeleton" />
            </Box>

            <Box className="favorite-pokemon-card-content">
                <Box className="favorite-pokemon-header">
                    <Skeleton variant="text" width={120} height={32} />
                    <Skeleton variant="text" width={50} height={24} />
                </Box>

                <Box className="favorite-pokemon-types">
                    <Skeleton variant="rounded" width={70} height={24} />
                    <Skeleton variant="rounded" width={70} height={24} />
                </Box>

                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="80%" height={20} />
                <Skeleton variant="text" width="90%" height={20} />
            </Box>
        </Card>
    );
};

export default FavoritePokemonCardSkeleton;
