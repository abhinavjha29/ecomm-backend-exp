import app from './app';
import Database from './config/database';

const PORT = process.env['PORT'] || 5080;

async function startServer() {
  try {
    await Database.connect(); // Initialize DB connection before starting Express
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
