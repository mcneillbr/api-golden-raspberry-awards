import { Router, Request, Response, NextFunction } from 'express';

import { MovieAwardDataStore } from '../../persistence/datastore';

const router = Router()

router.use((_req: Request, _res: Response, next: NextFunction) => {
  console.info('Time: ', new Date().toISOString());
  next();
});

const homeHandler = ((_req: Request, res: Response) => {
  res.setHeader('content-type', ['application/json', 'text/json']);

  res.status(200).json({ message: 'server running' });
  res.end();
});

const healthCheckHandler = ((_req: Request, res: Response) => {
  res.setHeader('content-type', ['application/json', 'text/json']);

  const healthCheck: any = {
    uptime: process.uptime(),
    message: 'running',
    timestamp: Date.now()
  };

  res.status(200).json(healthCheck);
  res.end();
});

const getAllMovieAwardHandler = (async (_req: Request, res: Response) => {
  res.setHeader('content-type', ['application/json', 'text/json']);

  const result = await MovieAwardDataStore.getInstance().getAllMovieAward();

  res.status(200).json(result);
  res.end();
});

const getMovieIntervalHandler = (async (_req: Request, res: Response) => {
  res.setHeader('content-type', ['application/json', 'text/json']);

  const result = await MovieAwardDataStore.getInstance().getAwardSeries();

  res.status(200).json(result);
  res.end();
}); 

// define the home page route
router.get('/', homeHandler);

// define the health check page route
router.get('/healthcheck', healthCheckHandler);

// define the get movies page route
router.get('/get-all-movie-award', getAllMovieAwardHandler);

// define the get movie interval page route
router.get('/get-movie-interval', getMovieIntervalHandler);


export default router;
