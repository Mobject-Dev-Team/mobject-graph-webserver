export class NumberLimiter {
  #minimum;
  #maximum;
  #value;
  #numberType;
  #precision;
  #limitMinimum;
  #limitMaximum;

  constructor(
    minimum,
    maximum,
    initialValue,
    numberType = null,
    precision = 2
  ) {
    this.#minimum = minimum;
    this.#maximum = maximum;
    this.#value = initialValue;
    this.#numberType = numberType;
    this.#precision = precision;

    this.#initLimits();
    this.setValue(this.#value);
  }

  #shouldAdjust(number) {
    if (this.#numberType === "odd" && number % 2 === 0) return true;
    if (this.#numberType === "even" && number % 2 !== 0) return true;
    return false;
  }

  #adjustLimit(limit, adjustment) {
    return this.#shouldAdjust(limit) ? limit + adjustment : limit;
  }

  #initLimits() {
    this.#limitMinimum = this.#adjustLimit(this.#minimum, 1);
    this.#limitMaximum = this.#adjustLimit(this.#maximum, -1);
  }

  setValue(newValue) {
    if (this.#shouldAdjust(newValue)) {
      newValue += 1;
    }
    newValue = parseFloat(newValue.toFixed(this.#precision));
    this.#value = Math.min(
      Math.max(newValue, this.#limitMinimum),
      this.#limitMaximum
    );
  }

  incrementBy(amount) {
    if (this.#shouldAdjust(this.#value + amount)) {
      amount += 1;
    }
    this.setValue(this.#value + amount);
  }

  decrementBy(amount) {
    if (this.#shouldAdjust(this.#value - amount)) {
      amount += 1;
    }
    this.setValue(this.#value - amount);
  }

  getValue() {
    return this.#value;
  }
}
