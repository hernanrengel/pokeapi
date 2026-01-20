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
import { AuthService } from './src/services/auth.service.js';
import { UserService } from './src/services/user.service.js';
import { authenticate } from './src/middleware/auth.middleware.js';

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ============= Auth Endpoints (Public) =============

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const result = await AuthService.register(email, password, name);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const result = await AuthService.login(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: (error as Error).message });
  }
});

app.get('/api/auth/me', authenticate, async (req, res) => {
  try {
    const user = await UserService.getUserById(req.user!.userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// ============= Pokemon Endpoints (Public) =============

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

app.get('/api/pokemon/search', async (req, res) => {
  try {
    const name = req.query.name as string;

    if (!name) {
      res.status(400).json({ error: 'Name query parameter is required' });
      return;
    }

    const query = name.toLowerCase();
    let results: any[] = [];

    // Try 1: Search by Pokemon name
    try {
      const pokemon = await PokeApiService.getPokemonDetail(query);
      results = [pokemon]; // Wrap in array for consistency
      res.json(results);
      return;
    } catch (nameError) {
      // Pokemon name not found, try other methods
    }

    // Try 2: Search by ability
    try {
      results = await PokeApiService.searchByAbility(query);
      if (results.length > 0) {
        res.json(results);
        return;
      }
    } catch (abilityError) {
      // Ability not found, try type
    }

    // Try 3: Search by type
    try {
      results = await PokeApiService.searchByType(query);
      if (results.length > 0) {
        res.json(results);
        return;
      }
    } catch (typeError) {
      // Type not found
    }

    // Nothing found
    res.status(404).json({ error: `No Pokemon found for '${req.query.name}'` });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
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

// ============= Favorites Endpoints (Protected) =============

app.get('/api/favorites', authenticate, async (req, res) => {
  try {
    const data = await FavoritesService.getFavorites(req.user!.userId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post('/api/favorites', authenticate, async (req, res) => {
  try {
    const { pokemonId } = req.body;
    if (typeof pokemonId !== 'number') {
      res.status(400).json({ error: 'pokemonId must be a number' });
      return;
    }
    const data = await FavoritesService.addFavorite(pokemonId, req.user!.userId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.get('/api/favorites/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const favorite = await FavoritesService.getFavoriteById(id, req.user!.userId);

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

app.delete('/api/favorites/:pokemonId', authenticate, async (req, res) => {
  try {
    const pokemonId = parseInt(req.params.pokemonId);
    if (isNaN(pokemonId)) {
      res.status(400).json({ error: 'pokemonId must be a valid number' });
      return;
    }
    const data = await FavoritesService.removeFavorite(pokemonId, req.user!.userId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
