import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme/theme';
import PokemonList from './pages/PokemonList/';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<PokemonList />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
