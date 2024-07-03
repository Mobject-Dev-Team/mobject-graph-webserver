export class NumericContent {
  constructor(content) {
    this.content = content;
    this.metadata = new Map(
      (content.metadata ?? []).map((m) => [m.name.toLowerCase(), m.value])
    );
    this.datatype = content.datatype || {};
  }

  get precision() {
    return this.getMetadataOrDefault(
      "precision",
      this.datatype.isFloat ? 2 : 0
    );
  }

  get defaultValue() {
    return this.content?.defaultValue || 0;
  }

  getMetadataOrDefault(key, defaultValue) {
    return this.metadata.get(key.toLowerCase()) || defaultValue;
  }
}
