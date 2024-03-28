class ContentBase {
  _value = null;

  constructor() {}

  update(data) {
    setValue(data.datatype.value);
  }

  setValue(newValue) {
    if (newValue !== this._value) {
      const oldValue = this._value;
      this._value = newValue;
    }
  }
}
