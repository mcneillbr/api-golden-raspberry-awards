import {
  IDValueObject,
  ProducerValueObject,
  StudioValueObject,
  TitleValueObject,
  YearValueObject
} from '@/domain/value-object';
import { MovieDto } from '@/domain/model/dtos';

export class MovieEntity {
  constructor(
    public readonly id: IDValueObject,
    public readonly title: TitleValueObject,
    public readonly year: YearValueObject,
    public readonly studios: StudioValueObject[],
    public readonly producers: ProducerValueObject[],
  ) { }

  public getDto(): MovieDto {
    return {
      id: this.id.getValue(),
      title: this.title.getValue(),
      year: this.year.getValue(),
      studios: this.studios.map((studio) => studio.getValue()),
      producers: this.producers.map((producer) => producer.getValue())
    }
  }
}
