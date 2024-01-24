import { ValueObject } from './value-object';

export class WinnerValueObject extends ValueObject<boolean> {
  public override isValid(): boolean {
    return (this.value !== undefined && typeof this.value === 'boolean');
  }

  public override equals(vo: ValueObject<boolean>): boolean {
    return (this.isValid() && this.value === vo.getValue());
  }
}
