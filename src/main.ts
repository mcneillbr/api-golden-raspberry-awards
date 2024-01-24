import { createServer, shutdownServer } from './infrastructure/transport/http/http-server';
import { ConfigurationManager } from './infrastructure/configuration/configuration-manager';
import { mongoMemoryServerSetup } from './infrastructure/database/server/mongo-memory-server';
import { IMongoClientConfiguration, mongoClientSetup } from './infrastructure/database/client';
import { MovieAwardDataStore } from './infrastructure/persistence/datastore';
import { checkFileExists } from './main/helpers';

interface IMongoDatabaseConfiguration {
  stopMongoMemoryServer(): Promise<void>;
  mongoClientConfiguration: IMongoClientConfiguration;
}

async function mongoDatabaseSetup(configuration: ConfigurationManager): Promise<IMongoDatabaseConfiguration> {
  const mongoDBPort = configuration.getInt('MONGODB_PORT', 27017);

  const mongoDBName = configuration.get('MONGODB_DB', 'master');

  const mongoCollection = configuration.get('MONGODB_COLLECTION', 'golden_raspberry_awards');

  const mongod = mongoMemoryServerSetup(mongoDBPort, mongoDBName);

  const mongodUri = await mongod.createMongoMemoryServer();

  const mongoClientConnection = await mongoClientSetup(mongodUri, mongoDBName, mongoCollection);

  return { stopMongoMemoryServer: mongod.stopMongoMemoryServer, mongoClientConfiguration: mongoClientConnection };
}

async function httpServerSetup(configuration: ConfigurationManager): Promise<void> {
  const port = configuration.getInt('APP_SERVER_PORT', 3000);

  await createServer(port);
}

async function setupDataStore(configuration: ConfigurationManager, mongoClientConnection: IMongoClientConfiguration) {
  const csvFile = configuration.get('CSV_FILE', '');

  const csvDelimiter = configuration.get('CSV_DELIMITER', ';');

  const hasCsvFile = await checkFileExists(csvFile);

  if (!hasCsvFile) {
    throw new Error(`CSV File "${csvFile}" not exists`);
  }

  await MovieAwardDataStore.setupDataStore({ mongoClientConfiguration: mongoClientConnection, csvFile, csvDelimiter });
}

(async () => {
  const configuration = ConfigurationManager.configure();

  const mongoDatabaseConfig = await mongoDatabaseSetup(configuration);

  await setupDataStore(configuration, mongoDatabaseConfig.mongoClientConfiguration);

  await httpServerSetup(configuration);

  const gracefulClose = async (signal: any) => {
    console.log(`Received ${signal}`);

    await mongoDatabaseConfig.mongoClientConfiguration.closeConnection();

    await mongoDatabaseConfig.stopMongoMemoryServer();

    shutdownServer();
    
    console.log('server finished');

    process.exit(0);
  };

  process.on('SIGINT', gracefulClose);
  process.on('SIGTERM', gracefulClose);
  process.on("SIGUSR2", gracefulClose);
})().then(() => console.info('server is starting'));
