import React from 'react';
import { Button, Box, Chip } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';
import './styles.css';

const Nav: React.FC = () => {
    const { favorites } = useFavorites();

    return (
        <Box className="nav-container">
            <Button
                color="inherit"
                component={Link}
                to="/"
                startIcon={<HomeIcon />}
                className="nav-button"
            >
                Home
            </Button>
            {favorites.length > 0 && (
                <Chip
                    icon={<FavoriteIcon className="favorites-icon" />}
                    label={`${favorites.length} Favorite${favorites.length > 1 ? 's' : ''}`}
                    className="favorites-chip"
                    component={Link}
                    to="/favorites"
                    clickable
                />
            )}
        </Box>
    );
};

export default Nav;
