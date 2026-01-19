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
                    <Box sx={{ display: 'flex', gap: 1.5, ml: 'auto' }}>
                        <Button
                            color="inherit"
                            startIcon={<LoginIcon />}
                            onClick={() => setLoginModalOpen(true)}
                            className="nav-button"
                        >
                            Login
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<PersonAddIcon />}
                            onClick={() => setRegisterModalOpen(true)}
                            sx={{
                                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                borderRadius: '12px',
                                padding: '8px 20px',
                                fontWeight: 600,
                                textTransform: 'none',
                                boxShadow: '0 4px 12px rgba(79, 172, 254, 0.4)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 20px rgba(79, 172, 254, 0.6)',
                                },
                            }}
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

