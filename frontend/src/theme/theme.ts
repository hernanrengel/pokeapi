import { createTheme } from '@mui/material/styles';

export const typeColors: Record<string, string> = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    steel: '#B7B7CE',
    fairy: '#D685AD',
};

/**
 * Get the color associated with a Pokemon type
 * @param type - The Pokemon type name
 * @returns The hex color code for the type
 */
export const getPokemonTypeColor = (type: string): string => {
    return typeColors[type.toLowerCase()] || typeColors.normal;
};

const theme = createTheme({
    palette: {
        primary: {
            main: '#CC0000',
        },
        secondary: {
            main: '#3B4CCA',
        },
        background: {
            default: '#f5f5f5',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 600,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 500,
        },
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                },
            },
        },
    },
});

export default theme;
