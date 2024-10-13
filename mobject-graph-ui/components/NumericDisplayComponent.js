export class NumericDisplayComponent {
  constructor(label, defaultValue, precision, colorGenerator) {
    this.label = label;
    this.precision = precision;
    this.colorGenerator = colorGenerator;
    this._value = defaultValue;
    this.setupDefaults();
  }

  setupDefaults() {
    this.labelFont = "12px Arial";
    this.valueFont = "12px Arial";
    this.margin = 20;
    this.labelTextColor = this.colorGenerator.getLabelColor();
    this.valueTextColor = this.colorGenerator.getValueColor();
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
  }

  computeSize() {
    return new Float32Array([220, 20]);
  }

  draw(ctx, node, widget_width, y, H) {
    ctx.textAlign = "left";
    const drawWidth = widget_width - this.margin * 2;
    this.drawLabel(ctx, y, H);
    this.drawValue(ctx, drawWidth, y, H);
  }

  drawLabel(ctx, y, H) {
    ctx.font = this.labelFont;
    ctx.fillStyle = this.labelTextColor;
    ctx.fillText(this.label, this.margin, y + H * 0.7);
  }

  drawValue(ctx, drawWidth, y, H) {
    ctx.font = this.valueFont;
    ctx.fillStyle = this.valueTextColor;
    ctx.textAlign = "right";
    ctx.fillText(
      Number(this._value).toFixed(this.precision),
      drawWidth + this.margin - 5,
      y + H * 0.7
    );
  }
}
