import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

import { PokeApiService } from './src/services/pokeApi.service.js';
import { FavoritesService } from './src/services/favorites.service.js';

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/pokemon', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;
    const data = await PokeApiService.getPokemonList(limit, offset);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.get('/api/pokemon/:id', async (req, res) => {
  try {
    const data = await PokeApiService.getPokemonDetail(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.get('/api/favorites', async (req, res) => {
  try {
    const data = await FavoritesService.getFavorites();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post('/api/favorites', async (req, res) => {
  try {
    const { pokemonId } = req.body;
    if (typeof pokemonId !== 'number') {
      res.status(400).json({ error: 'pokemonId must be a number' });
      return;
    }
    const data = await FavoritesService.addFavorite(pokemonId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.get('/api/favorites/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const favorite = await FavoritesService.getFavoriteById(id);

    if (!favorite) {
      res.status(404).json({ error: 'Favorite not found' });
      return;
    }

    const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${favorite.pokemonId}`);
    res.json({
      ...favorite,
      pokemon: pokemonResponse.data
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.delete('/api/favorites/:pokemonId', async (req, res) => {
  try {
    const pokemonId = parseInt(req.params.pokemonId);
    if (isNaN(pokemonId)) {
      res.status(400).json({ error: 'pokemonId must be a valid number' });
      return;
    }
    const data = await FavoritesService.removeFavorite(pokemonId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
