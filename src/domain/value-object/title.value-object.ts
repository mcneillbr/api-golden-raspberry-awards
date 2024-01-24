import { ValueObject } from './value-object';

export class TitleValueObject extends ValueObject<string> {
  public override isValid(): boolean {
    return this.value !== undefined && typeof this.value === 'string' && this.value.trim() !== ''
  }

  public override equals(vo: ValueObject<string>): boolean {
    return (this.isValid() && this.value === vo.getValue())
  }
}
