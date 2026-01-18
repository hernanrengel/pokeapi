import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme/theme';
import PokemonList from './pages/PokemonList/';
import Header from './components/Header';
import { FavoritesProvider } from './context/FavoritesContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FavoritesProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<PokemonList />} />
          </Routes>
        </Router>
      </FavoritesProvider>
    </ThemeProvider>
  );
}

export default App;
