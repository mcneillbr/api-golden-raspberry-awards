import http from 'http';

import express from 'express';

import logger from 'morgan';

import router from './route-handler';

const httpServer = express();

let runningServer: http.Server;

httpServer.use(logger('dev'));
httpServer.use(express.json());
httpServer.use(express.urlencoded({ extended: false }));

httpServer.use((err: any, _req: any, res: any, _next: any) => {
  console.error('express error', err.stack);
  res.status(500).send('Something broke!');
});

httpServer.use('/', router);

async function createServer(port: number) {
  runningServer = httpServer.listen(port, () => {
    console.log(`server app listening on port ${port}`);
    console.info('server running...');
  });
}

function shutdownServer() {
  if (runningServer?.listening) {
    runningServer.close();
  }
}

export { httpServer, createServer, shutdownServer };
