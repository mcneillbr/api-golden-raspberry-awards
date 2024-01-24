import request from 'supertest';
import { createServer, httpServer, shutdownServer } from './../../src/infrastructure/transport/http/http-server';
import { ConfigurationManager } from './../../src/infrastructure/configuration/configuration-manager';

describe('End to End Testing Http Server', () => {
  beforeAll(async () => {
    const configuration = ConfigurationManager.configure();

    const port = configuration.getInt('APP_SERVER_PORT', 3000);

    await createServer(port);
  });

  afterAll(() => {
    shutdownServer();
  });

  it('should load the contents of the API home', async () => {
    const response = await request(httpServer).get('/').set('Accept', 'application/json');

    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.headers['content-length']).toMatch('28');
    expect(response.status).toEqual(200);
    expect(response.body.message).toEqual('server running');
  });

  it('should load the health check on server', async () => {
    const response = await request(httpServer).get('/healthcheck').set('Accept', 'application/json');

    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.headers['content-length']).toMatch('66');
    expect(response.status).toEqual(200);
    expect(response.body.message).toEqual('running');
  });
});
