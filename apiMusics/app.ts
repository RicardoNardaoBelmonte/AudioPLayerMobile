import express from 'express';
import cors from 'cors';
import routes from './Routes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/api', routes);

export default app;