import { PrismaClient } from '@prisma/client';
import Database from '../../src/config/database';

/**
 * Test database utilities for managing test data
 */
export class TestDatabase {
  private static prisma: PrismaClient;

  static async initialize(): Promise<void> {
    this.prisma = Database.getInstance();
  }

  /**
   * Clean all tables in the database
   */
  static async cleanup(): Promise<void> {
    if (!this.prisma) {
      await this.initialize();
    }

    // Delete in correct order to respect foreign key constraints
    await this.prisma.users.deleteMany({});
    // Add other tables as needed
  }

  /**
   * Disconnect from database
   */
  static async disconnect(): Promise<void> {
    await Database.disconnect();
  }

  /**
   * Get Prisma client instance
   */
  static getInstance(): PrismaClient {
    if (!this.prisma) {
      this.prisma = Database.getInstance();
    }
    return this.prisma;
  }
}
