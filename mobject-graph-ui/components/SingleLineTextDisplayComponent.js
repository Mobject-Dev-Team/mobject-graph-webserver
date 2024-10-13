export class SingleLineTextDisplayComponent {
  constructor(label, defaultValue, colorGenerator) {
    this.label = label;
    this.colorGenerator = colorGenerator;
    this._text = defaultValue;
    this.setupDefaults();
  }

  setupDefaults() {
    this.labelFont = "12px Arial";
    this.labelTextColor = this.colorGenerator.getLabelColor();
    this.valueFont = "12px Arial";
    this.valueTextColor = this.colorGenerator.getValueColor();
    this.margin = 20;
    this.outlineColor = this.colorGenerator.getBorderColor();
    this.backgroundColor = this.colorGenerator.getBackgroundColor();
  }

  get text() {
    return this._text;
  }

  set text(value) {
    this._text = value;
  }

  computeSize() {
    return new Float32Array([220, 20]);
  }

  draw(ctx, node, widget_width, y, H) {
    ctx.textAlign = "left";
    const drawWidth = widget_width - this.margin * 2;
    this.drawLabel(ctx, y, H);
    this.drawText(ctx, drawWidth, y, H);
  }

  drawLabel(ctx, y, H) {
    ctx.font = this.labelFont;
    ctx.fillStyle = this.labelTextColor;
    ctx.fillText(this.label, this.margin, y + H * 0.7);
  }

  drawText(ctx, drawWidth, y, H) {
    ctx.font = this.valueFont;
    ctx.fillStyle = this.valueTextColor;
    ctx.textAlign = "right";
    ctx.fillText(this._text, drawWidth + this.margin, y + H * 0.7);
  }
}
