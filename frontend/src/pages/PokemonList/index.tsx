import React from 'react';
import { Grid, Container, Box, Typography } from '@mui/material';
import PokemonCard from './components/PokemonCard';
import PokemonCardSkeleton from './components/PokemonCardSkeleton';
import Pagination from '../../components/Pagination';
import { usePokemonList } from '../../hooks/usePokemonList';
import './styles.css';

const PokemonList: React.FC = () => {
    const { pokemonList, loading, error, page, setPage, totalPages } = usePokemonList();

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (error) {
        return (
            <Box className="pokemon-list-error-container">
                <Typography color="error" variant="h6">{error}</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth={false} sx={{ maxWidth: '800px', width: '100%', mx: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }} className="pokemon-list-container">
            <Typography variant="h3" component="h1" gutterBottom className="pokemon-list-title">
                Pokédex
            </Typography>
            <Grid container spacing={3} justifyContent="center">
                {loading ? (
                    Array.from(new Array(12)).map((_, index) => (
                        <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
                            <PokemonCardSkeleton />
                        </Grid>
                    ))
                ) : (
                    pokemonList.map((pokemon) => (
                        <Grid key={pokemon.id} size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
                            <PokemonCard pokemon={pokemon} />
                        </Grid>
                    ))
                )}
            </Grid>
            {!loading && (
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                />
            )}
        </Container>
    );
};

export default PokemonList;
