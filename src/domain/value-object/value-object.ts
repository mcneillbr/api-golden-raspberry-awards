export abstract class ValueObject<T> {
  constructor(protected value: T) { }

  public abstract equals(value: ValueObject<T>): boolean;

  public abstract isValid(): boolean;

  public getValue(): T {
    return this.value;
  }

  public toString(): string {
    return String(this.value);
  }
}
