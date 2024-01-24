import { ValueObject } from './value-object';

export class IDValueObject extends ValueObject<number> {
  public override isValid(): boolean {
    return (this.value !== undefined
      && typeof this.value === 'number'
      && this.value >= 0);
  }

  public override equals(vo: ValueObject<number>): boolean {
    return (this.isValid() && this.value === vo.getValue());
  }
}
