import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import loginRoutes from './routes/loginRoutes';
import logoutRoutes from './routes/logoutRoutes';
import profileRoutes from './routes/profileRoutes';
import { getDbConnectionSummary, query } from './db';

dotenv.config({ override: true });

const app = express();
app.use(cors());
app.use(express.json());
app.use(loginRoutes);
app.use(logoutRoutes);
app.use(profileRoutes);

const PORT = process.env.PORT || 8080;

async function start() {
  try {
    console.log('Database config:', getDbConnectionSummary());
    await query('SELECT 1');
    console.log('Database connection verified.');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to database on startup:', error);
    process.exit(1);
  }
}

void start();
