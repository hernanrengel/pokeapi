import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import './styles.css';

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder = 'Search by name, ability, or type...' }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query.trim());
    };

    const handleSearchClick = () => {
        onSearch(query.trim());
    };

    const handleClear = () => {
        setQuery('');
        onSearch(''); // Clear the search
    };

    return (
        <Box className="search-bar-container">
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <TextField
                    fullWidth
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className="search-input"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon className="search-icon" />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                {query && (
                                    <IconButton onClick={handleClear} size="small" className="clear-button">
                                        <ClearIcon />
                                    </IconButton>
                                )}
                                <IconButton
                                    onClick={handleSearchClick}
                                    size="medium"
                                    className="search-button"
                                    type="button"
                                >
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </form>
        </Box>
    );
};

export default SearchBar;
