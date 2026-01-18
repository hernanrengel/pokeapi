import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import Nav from '../Nav';
import './styles.css';

const Header: React.FC = () => {
    return (
        <AppBar position="sticky" className="header">
            <Toolbar>
                <Typography variant="h6" component="div" className="header-title">
                    PokeAPI Challenge
                </Typography>
                <Nav />
            </Toolbar>
        </AppBar>
    );
};

export default Header;
