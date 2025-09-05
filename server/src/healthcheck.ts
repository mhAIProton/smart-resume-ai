import { createConnection } from 'typeorm';
import { config } from 'dotenv';

// Load environment variables
config();

async function healthCheck() {
  try {
    // Check database connection
    const connection = await createConnection({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'smart_resume_ai',
    });
    
    await connection.close();
    
    console.log('Health check passed');
    process.exit(0);
  } catch (error) {
    console.error('Health check failed:', error);
    process.exit(1);
  }
}

healthCheck();

