import React, { useState } from 'react';
import { Grid, Container, Box, Typography, Chip } from '@mui/material';
import PokemonCard from './components/PokemonCard';
import PokemonCardSkeleton from './components/PokemonCardSkeleton';
import Pagination from '../../components/Pagination';
import SearchBar from '../../components/SearchBar';
import PokemonDetailModal from '../../components/PokemonDetailModal';
import { usePokemonList } from '../../hooks/usePokemonList';
import { useSearch } from '../../hooks/useSearch';
import type { PokemonDetail } from '../../types/pokemon';
import './styles.css';

const PokemonList: React.FC = () => {
    const { pokemonList, loading, error, page, setPage, totalPages } = usePokemonList();
    const { searchPokemon, results: searchResults, loading: searchLoading, error: searchError, clearResults } = useSearch();
    const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetail | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    // Show search results or regular pokemon list
    const displayedPokemon = isSearching ? searchResults : pokemonList;
    const isLoading = isSearching ? searchLoading : loading;

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        setIsSearching(false);
        clearResults();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSearch = async (query: string) => {
        if (!query.trim()) {
            // Clear search
            setIsSearching(false);
            clearResults();
            return;
        }

        setIsSearching(true);
        await searchPokemon(query);
    };

    const handleCardClick = (pokemon: PokemonDetail) => {
        setSelectedPokemon(pokemon);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedPokemon(null);
    };

    if (error) {
        return (
            <Box className="pokemon-list-error-container">
                <Typography color="error" variant="h6">{error}</Typography>
            </Box>
        );
    }

    const showNoResults = !isLoading && isSearching && (searchError || searchResults.length === 0);
    const showResults = !isLoading && displayedPokemon.length > 0;

    return (
        <Container maxWidth={false} sx={{ maxWidth: '1200px', width: '100%', mx: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }} className="pokemon-list-container">
            <Typography variant="h3" component="h1" gutterBottom className="pokemon-list-title">
                Pokédex
            </Typography>

            <SearchBar onSearch={handleSearch} />

            {/* Search Results Info */}
            {isSearching && showResults && (
                <Box sx={{ mb: 2, width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <Chip
                        label={`Found ${searchResults.length} Pokemon`}
                        color="primary"
                        className="search-results-chip"
                    />
                </Box>
            )}

            <Grid container spacing={3} justifyContent="center">
                {isLoading ? (
                    Array.from(new Array(12)).map((_, index) => (
                        <Grid key={index}>
                            <PokemonCardSkeleton />
                        </Grid>
                    ))
                ) : showNoResults ? (
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ textAlign: 'center', py: 8, width: '100%' }}>
                            <Typography variant="h5" color="text.secondary" gutterBottom>
                                {searchError || 'No Pokemon found'}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Try searching for a different name, ability, or type
                            </Typography>
                        </Box>
                    </Grid>
                ) : (
                    displayedPokemon.map((pokemon) => (
                        <Grid key={pokemon.id}>
                            <PokemonCard pokemon={pokemon} onClick={handleCardClick} />
                        </Grid>
                    ))
                )}
            </Grid>

            {!isLoading && !isSearching && (
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                />
            )}

            <PokemonDetailModal
                open={modalOpen}
                onClose={handleCloseModal}
                pokemon={selectedPokemon}
            />
        </Container>
    );
};

export default PokemonList;
