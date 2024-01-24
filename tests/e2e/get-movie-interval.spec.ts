import request from 'supertest';
import { createServer, httpServer, shutdownServer } from './../../src/infrastructure/transport/http/http-server';
import { ConfigurationManager } from './../../src/infrastructure/configuration/configuration-manager';

import { mongoMemoryServerSetup } from './../../src/infrastructure/database/server/mongo-memory-server';
import { IMongoClientConfiguration, mongoClientSetup } from './../../src/infrastructure/database/client';
import { MovieAwardDataStore } from './../../src/infrastructure/persistence/datastore';
import { checkFileExists } from './../../src/main/helpers';
import { MOCK_GET_MOVIE_INTERVAL_RESULT } from '../__common__/get-movie-interval.mock';

interface IMongoDatabaseConfiguration {
  stopMongoMemoryServer(): Promise<void>;
  mongoClientConfiguration: IMongoClientConfiguration;
}

async function createMongoDatabaseSut(configuration: ConfigurationManager): Promise<IMongoDatabaseConfiguration> {
  const mongoDBPort = configuration.getInt('MONGODB_PORT', 27017);

  const mongoDBName = configuration.get('MONGODB_DB', 'master');

  const mongoCollection = configuration.get('MONGODB_COLLECTION', 'golden_raspberry_awards');

  const mongod = mongoMemoryServerSetup(mongoDBPort, mongoDBName);

  const mongodUri = await mongod.createMongoMemoryServer();

  const mongoClientConnection = await mongoClientSetup(mongodUri, mongoDBName, mongoCollection);

  return { stopMongoMemoryServer: mongod.stopMongoMemoryServer, mongoClientConfiguration: mongoClientConnection };
}

async function createDataStoreSut(
  configuration: ConfigurationManager,
  mongoClientConfiguration: IMongoClientConfiguration
) {
  const csvFile = configuration.get('CSV_FILE', '');

  const csvDelimiter = configuration.get('CSV_DELIMITER', ';');

  const hasCsvFile = await checkFileExists(csvFile);

  if (!hasCsvFile) {
    throw new Error(`CSV File "${csvFile}" not exists`);
  }

  await MovieAwardDataStore.setupDataStore({ mongoClientConfiguration, csvFile, csvDelimiter });
}

describe('Get a list of award-winning producers', () => {
  let mongoDatabaseConfig: IMongoDatabaseConfiguration;

  beforeAll(async () => {
    const configuration = ConfigurationManager.configure();

    mongoDatabaseConfig = await createMongoDatabaseSut(configuration);

    await createDataStoreSut(configuration, mongoDatabaseConfig.mongoClientConfiguration);

    const port = configuration.getInt('APP_SERVER_PORT', 3000);

    await createServer(port);
  });

  afterAll(async () => {
    await mongoDatabaseConfig.mongoClientConfiguration.closeConnection();

    await mongoDatabaseConfig.stopMongoMemoryServer();

    shutdownServer();
  });

  it('should return a list of award-winning producers', async () => {
    const response = await request(httpServer).get('/get-all-movie-award').set('Accept', 'application/json');

    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.headers['content-length']).toMatch('34962');
    expect(response.status).toEqual(200);
    expect(response.body).toHaveLength(206);
  });

  it('should return a list of award-winning producers', async () => {
    const response = await request(httpServer).get('/get-movie-interval').set('Accept', 'application/json');

    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.headers['content-length']).toMatch('339');
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject(MOCK_GET_MOVIE_INTERVAL_RESULT);
  });
});
