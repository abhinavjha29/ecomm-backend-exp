import { PrismaClient } from '../../prisma/generated/prisma';

class Database {
  private static instance: PrismaClient;

  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!Database.instance) {
      // Use TEST_DATABASE_URL if in test environment
      const databaseUrl =
        process.env['NODE_ENV'] === 'test'
          ? process.env['TEST_DATABASE_URL']
          : process.env['DATABASE_URL'];

      Database.instance = new PrismaClient({
        datasources: {
          db: {
            url: databaseUrl
          }
        }
      });
    }
    return Database.instance;
  }

  public static async connect() {
    const client = this.getInstance();
    await client.$connect();
    console.log('Database connected');
  }

  public static async disconnect() {
    if (this.instance) {
      await this.instance.$disconnect();
      console.log('Database disconnected');
    }
  }
}

export default Database;
