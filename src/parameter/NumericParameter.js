class NumericParameter {
  constructor(parameter) {
    this.parameter = parameter;
    this.metadata = new Map(
      (parameter.metadata ?? []).map((m) => [m.name.toLowerCase(), m.value])
    );
    this.datatype = parameter.datatype || {};
  }

  get minimumValue() {
    return this.getMetadataOrDefault(
      "minimumValue",
      this.datatype.minValue || 0
    );
  }

  get maximumValue() {
    return this.getMetadataOrDefault(
      "maximumValue",
      this.datatype.maxValue || 0
    );
  }

  get precision() {
    return this.getMetadataOrDefault(
      "precision",
      this.datatype.isFloat ? 2 : 0
    );
  }

  get onlyOdd() {
    return this.getMetadataOrDefault("onlyOdd", false);
  }

  get onlyEven() {
    return this.getMetadataOrDefault("onlyEven", false);
  }

  get defaultValue() {
    return this.parameter.defaultValue;
  }

  getMetadataOrDefault(key, defaultValue) {
    return this.metadata.get(key.toLowerCase()) || defaultValue;
  }

  getNumberLimiter() {
    // Determine the number constraint based on metadata flags
    let constraint = null;
    if (this.onlyOdd) {
      constraint = "odd";
    } else if (this.onlyEven) {
      constraint = "even";
    }

    // Create and return the NumberLimiter with calculated properties
    return new NumberLimiter(
      this.minimumValue,
      this.maximumValue,
      this.defaultValue,
      constraint,
      this.precision
    );
  }
}
