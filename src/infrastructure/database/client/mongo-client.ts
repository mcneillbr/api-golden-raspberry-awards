import { Collection, Db, Document, MongoClient } from 'mongodb';

import { schema } from './mongo-schema';

export interface IMongoClientConfiguration {
  mongoClient: MongoClient;
  database: Db;
  graCollection: Collection<Document>;
  closeConnection(): Promise<void>;
};

export async function mongoClientSetup(
  mongodUri: string,
  mongoDBName: string,
  mongoCollection: string
): Promise<IMongoClientConfiguration> {
  const mongoClient = new MongoClient(mongodUri);

  await mongoClient.connect();

  const database = mongoClient.db(mongoDBName);

  const graCollection = await database.createCollection(mongoCollection, {
    autoIndexId: true,
    validator: schema,
  });

  async function closeConnection(): Promise<void> {
    await mongoClient.close();
  }

  return {
    mongoClient,
    database,
    graCollection,
    closeConnection,
  };
}
