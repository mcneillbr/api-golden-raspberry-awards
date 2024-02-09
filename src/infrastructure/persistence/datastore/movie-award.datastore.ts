import fs from 'fs';
import { parse as csvParse } from 'csv';
import { IMongoClientConfiguration } from '../../database/client';
import { MovieAwardDto, MovieIntervals } from '@/interfaces';
import { getAwardSeries } from '../queries';

function parseBoolean(value: string): number {
  const regex = /on|yes|true|1/gim;

  return regex.test(value) ? 1 : 0;
}

function parseTextList(value: string): string[] {
  // clean extra space and unicode non-breaking space xa01
  const reCleanExtraSpace = /[\xA0\s]/gim;

  const values = value
    .split(', and')
    .join(',')
    .split(' and ')
    .join(', ')
    .split(', ');

  return values.map((entry) => entry.replace(reCleanExtraSpace, ' '));
}

export type MovieAwardDataStoreSetupOptions = {
  mongoClientConfiguration: IMongoClientConfiguration;
  csvFile: string;
  csvDelimiter?: string;
};

export class MovieAwardDataStore {
  private static instance: MovieAwardDataStore;

  protected constructor(private mongoClientConfiguration: IMongoClientConfiguration) {}

  static async setupDataStore(options: MovieAwardDataStoreSetupOptions): Promise<void> {
    MovieAwardDataStore.instance = new MovieAwardDataStore(options.mongoClientConfiguration);

    await MovieAwardDataStore.instance.loadGoldenRaspberryAwardsData(options.csvFile, options.csvDelimiter || ';');
  }

  public static getInstance(): MovieAwardDataStore {
    if (!MovieAwardDataStore.instance) {
      throw new Error('Call setup first');
    }

    return MovieAwardDataStore.instance;
  }

  private async loadGoldenRaspberryAwardsData(file: string, delimiter = ';'): Promise<void> {
    return new Promise((resolve, reject) => {
      const bulk = this.mongoClientConfiguration.graCollection.initializeUnorderedBulkOp();

      fs.createReadStream(file)
        .pipe(csvParse({ delimiter, fromLine: 2 }))
        .on('data', async (row) => {
          const insMovie = {
            title: row[1],
            year: parseInt(row[0]),
            studios: parseTextList(row[2]),
            producers: parseTextList(row[3]),
            winner: parseBoolean(row[4]),
          };

          try {
            bulk.insert(insMovie);
          } catch (error) {
            console.error(JSON.stringify(error));
            throw error;
          }
        })
        .on('end', async () => {
          if (bulk.batches.length > 0) await bulk.execute();
          console.log('import csv finished');
          resolve();
        })
        .on('error', (error) => {
          console.log(error.message);
          reject(error);
        });
    });
  }

  public async getAwardSeries(): Promise<MovieIntervals> {
    const gr = this.mongoClientConfiguration.graCollection.aggregate(getAwardSeries);

    if (await gr.hasNext()) {
      const result = (await gr.next()) as MovieIntervals;

      return result;
    }

    return {
      min: [],
      max: [],
    };
  }

  public async getAllMovieAward(): Promise<MovieAwardDto[]> {
    const result = await this.mongoClientConfiguration.graCollection.find().toArray();

    return result.map((row) => {
      return {
        id: row._id.toHexString(),
        title: row.title,
        year: row.year,
        studios: row.studios,
        producers: row.producers,
        winner: row.winner,
      };
    });
  }
}
