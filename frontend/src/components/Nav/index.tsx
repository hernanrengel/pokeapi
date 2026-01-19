import React, { useState } from 'react';
import { Button, Box, Chip, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';
import LoginModal from '../LoginModal';
import RegisterModal from '../RegisterModal';
import './styles.css';

const Nav: React.FC = () => {
    const { favorites } = useFavorites();
    const { isAuthenticated, user, logout } = useAuth();
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [registerModalOpen, setRegisterModalOpen] = useState(false);

    return (
        <>
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

                {isAuthenticated ? (
                    <>
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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
                            {user?.name && (
                                <Box className="user-name">
                                    {user.email} | {user.name}
                                </Box>
                            )}
                            <IconButton
                                color="inherit"
                                onClick={logout}
                                title="Logout"
                                size="small"
                            >
                                <LogoutIcon />
                            </IconButton>
                        </Box>
                    </>
                ) : (
                    <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
                        <Button
                            color="inherit"
                            startIcon={<LoginIcon />}
                            onClick={() => setLoginModalOpen(true)}
                        >
                            Login
                        </Button>
                        <Button
                            variant="outlined"
                            color="inherit"
                            startIcon={<PersonAddIcon />}
                            onClick={() => setRegisterModalOpen(true)}
                        >
                            Register
                        </Button>
                    </Box>
                )}
            </Box>

            <LoginModal
                open={loginModalOpen}
                onClose={() => setLoginModalOpen(false)}
            />
            <RegisterModal
                open={registerModalOpen}
                onClose={() => setRegisterModalOpen(false)}
            />
        </>
    );
};

export default Nav;

