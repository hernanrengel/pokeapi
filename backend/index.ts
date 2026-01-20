import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger.config.js';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Pokemon API Documentation',
}));

import { PokeApiService } from './src/services/pokeApi.service.js';
import { FavoritesService } from './src/services/favorites.service.js';
import { AuthService } from './src/services/auth.service.js';
import { UserService } from './src/services/user.service.js';
import { authenticate } from './src/middleware/auth.middleware.js';

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ============= Auth Endpoints (Public) =============

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       200:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/pokemon:
 *   get:
 *     summary: Get paginated list of Pokemon
 *     tags: [Pokemon]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of Pokemon to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of Pokemon to skip
 *     responses:
 *       200:
 *         description: Pokemon list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PokemonList'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/pokemon/search:
 *   get:
 *     summary: Search Pokemon by name, ability, or type
 *     tags: [Pokemon]
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Pokemon name, ability, or type to search for
 *         example: pikachu
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pokemon'
 *       400:
 *         description: Bad request - name parameter required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: No Pokemon found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/pokemon/{id}:
 *   get:
 *     summary: Get Pokemon details by ID or name
 *     tags: [Pokemon]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Pokemon ID or name
 *         example: 25
 *     responses:
 *       200:
 *         description: Pokemon details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pokemon'
 *       500:
 *         description: Pokemon not found or server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/api/pokemon/:id', async (req, res) => {
  try {
    const data = await PokeApiService.getPokemonDetail(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// ============= Favorites Endpoints (Protected) =============

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Get all favorites for the authenticated user
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's favorites
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Favorite'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/api/favorites', authenticate, async (req, res) => {
  try {
    const data = await FavoritesService.getFavorites(req.user!.userId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

/**
 * @swagger
 * /api/favorites:
 *   post:
 *     summary: Add a Pokemon to favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddFavoriteRequest'
 *     responses:
 *       200:
 *         description: Pokemon added to favorites
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Favorite'
 *       400:
 *         description: Bad request - invalid pokemonId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/favorites/{id}:
 *   get:
 *     summary: Get a specific favorite by ID with Pokemon details
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Favorite ID
 *     responses:
 *       200:
 *         description: Favorite with Pokemon details
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Favorite'
 *                 - type: object
 *                   properties:
 *                     pokemon:
 *                       $ref: '#/components/schemas/Pokemon'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Favorite not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/favorites/{pokemonId}:
 *   delete:
 *     summary: Remove a Pokemon from favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pokemonId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Pokemon ID to remove from favorites
 *         example: 25
 *     responses:
 *       200:
 *         description: Pokemon removed from favorites
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request - invalid pokemonId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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
