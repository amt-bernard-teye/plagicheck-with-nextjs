import { PrismaClient } from "@prisma/client";

export class DbConnection {
  private static _db: DbConnection;
  private _connection: PrismaClient | undefined;


  static getInstance() {
    if (DbConnection._db) {
      return DbConnection._db;
    }

    DbConnection._db = new DbConnection();
    return DbConnection._db;
  }

  
  async open() {
    if (this._connection) {
      await this._connection.$connect();
      return this._connection;
    }

    this._connection = new PrismaClient();
    return this._connection;
  }


  async close() {
    await this._connection?.$disconnect();
  }
}