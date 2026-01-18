import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

import { PokeApiService } from './src/services/pokeApi.service.js';

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
