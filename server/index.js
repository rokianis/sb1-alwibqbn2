import express from 'express';
import cors from 'cors';
import { pingServer } from './utils/ping.js';
import serverRoutes from './routes/servers.js';
import vpnRoutes from './routes/vpn.js';
import { logger } from './utils/logger.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, '../dist')));

// API Routes
app.use('/api/servers', serverRoutes);
app.use('/api/vpn', vpnRoutes);

app.post('/api/ping', async (req, res) => {
  try {
    const { ip } = req.body;
    const result = await pingServer(ip);
    res.json(result);
  } catch (error) {
    logger.error('Ping error:', error);
    res.status(500).json({ error: 'Failed to ping server' });
  }
});

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});