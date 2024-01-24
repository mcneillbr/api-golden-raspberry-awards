import { MongoMemoryServer } from 'mongodb-memory-server';

export interface IMongoMemoryServerConfiguration {
  createMongoMemoryServer(): Promise<string>;
  stopMongoMemoryServer(): Promise<void>;
}

export function mongoMemoryServerSetup(port: number, dbName: string): IMongoMemoryServerConfiguration {
  const promiseServer = MongoMemoryServer.create({
    instance: {
      port,
      dbName
    }
  });

  async function createMongoMemoryServer(): Promise<string> {
    const mongod = await promiseServer;
  
    return mongod.getUri();
  }
  
  async function stopMongoMemoryServer(): Promise<void> {
    const mongod = await promiseServer;
  
    await mongod.stop();
  }
  
  return {
    createMongoMemoryServer,
    stopMongoMemoryServer
  }

}
