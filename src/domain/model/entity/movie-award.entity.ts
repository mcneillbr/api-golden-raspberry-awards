import { WinnerValueObject } from '@/domain/value-object';
import { MovieEntity } from './movie.entity';
import { MovieAwardDto, MovieDto } from '../dtos';

export class MovieAwardEntity {
  constructor(
    public readonly movie: MovieEntity,
    public readonly winner: WinnerValueObject) { }

  public getDto(): MovieDto | Pick<MovieAwardDto, 'winner'> {
    const movieDto = this.movie.getDto();

    return {
      ...movieDto,
      winner: this.winner.getValue(),
    };
  }
}
