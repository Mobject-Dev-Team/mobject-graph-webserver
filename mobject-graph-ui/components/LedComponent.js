export class LedComponent {
  constructor(label, defaultValue, colorGenerator) {
    this.label = label;
    this.colorGenerator = colorGenerator;
    this._isActive = defaultValue;
    this.setupDefaults();
  }

  setupDefaults() {
    this.labelFont = "12px Arial";
    this.labelTextColor = this.colorGenerator.getLabelColor();
    this.margin = 20;
    this.outlineColor = this.colorGenerator.getBorderColor();
    this.valueFont = "12px Arial";
    this.valueTextColor = this.colorGenerator.getValueColor();
    this.trueIndicatorColor = "#39e75f";
    this.falseIndicatorColor = "#777";
  }

  get isActive() {
    return this._isActive;
  }

  set isActive(value) {
    this._isActive = value;
  }

  computeSize() {
    return new Float32Array([220, 20]);
  }

  draw(ctx, node, widget_width, y, H) {
    const drawWidth = widget_width - this.margin * 2;
    this.drawLabel(ctx, y, H);
    this.drawValue(ctx, drawWidth, y, H);
    this.drawIndicator(ctx, drawWidth, y, H);
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
      this._isActive ? "true" : "false",
      drawWidth + this.margin - 20,
      y + H * 0.7
    );
  }

  drawIndicator(ctx, drawWidth, y, H) {
    const ledColor = this._isActive
      ? this.trueIndicatorColor
      : this.falseIndicatorColor;

    const glowRadius = H * 0.6;
    const glowGradient = ctx.createRadialGradient(
      drawWidth + this.margin - 5,
      y + H * 0.5,
      0,
      drawWidth + this.margin - 5,
      y + H * 0.5,
      glowRadius
    );
    glowGradient.addColorStop(0, ledColor);
    glowGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    if (this._isActive) {
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(
        drawWidth + this.margin - 5,
        y + H * 0.5,
        glowRadius,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    ctx.fillStyle = ledColor;
    ctx.beginPath();
    ctx.arc(drawWidth + this.margin - 5, y + H * 0.5, H * 0.35, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#222";
    ctx.stroke();
  }
}
