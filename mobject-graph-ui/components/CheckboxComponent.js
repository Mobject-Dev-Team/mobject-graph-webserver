import { EventEmitter } from "../utils/EventEmitter.js";

export class CheckboxComponent {
  constructor(label, defaultValue, colorGenerator) {
    this.eventEmitter = new EventEmitter();
    this.label = label;
    this.colorGenerator = colorGenerator;
    this._isChecked = defaultValue;
    this.setupDefaults();
  }

  setupDefaults() {
    this.labelFont = "12px Arial";
    this.labelTextColor = this.colorGenerator.getLabelColor();
    this.margin = 20;
    this.outlineColor = this.colorGenerator.getBorderColor();
    this.backgroundColor = this.colorGenerator.getBackgroundColor();
    this.checkboxSize = 20;
    this.checkboxMargin = 5;
    this.checkboxColor = this.colorGenerator.getValueColor();
    this.checkboxX = 0;
    this.checkboxY = 0;
    this.labelEndPosition = 0;
  }

  get isChecked() {
    return this._isChecked;
  }

  set isChecked(value) {
    this._isChecked = value;
    this.eventEmitter.emit("onChange", this._isChecked);
  }

  on(eventName, listener) {
    this.eventEmitter.on(eventName, listener);
  }

  off(eventName, listener) {
    this.eventEmitter.off(eventName, listener);
  }

  isClickInZone(pos) {
    return (
      pos[0] >= this.checkboxX &&
      pos[0] <= this.checkboxX + this.labelEndPosition &&
      pos[1] >= this.checkboxY &&
      pos[1] <= this.checkboxY + this.checkboxSize
    );
  }

  onMouse(event, pos) {
    if (event.type === "pointerdown" && this.isClickInZone(pos)) {
      this.isChecked = !this.isChecked;
    }
  }

  computeSize() {
    return new Float32Array([60, 20]);
  }

  draw(ctx, node, widget_width, y, H) {
    this.drawLabel(ctx, y, H);
    this.drawCheckbox(ctx, y, H);
  }

  drawLabel(ctx, y, H) {
    ctx.font = this.labelFont;
    ctx.fillStyle = this.labelTextColor;
    const startX = this.margin * 2 + 5;
    ctx.fillText(this.label, startX, y + H * 0.7);
    const textWidth = ctx.measureText(this.label).width;
    const endX = startX + textWidth;
    this.labelEndPosition = endX;
  }

  drawCheckbox(ctx, y, H) {
    this.checkboxY = y + (H - this.checkboxSize) / 2;
    this.checkboxX = this.margin;

    ctx.fillStyle = this.backgroundColor;
    ctx.strokeStyle = this.outlineColor;
    ctx.beginPath();

    // ctx.roundRect(this.margin, y, drawWidth, H, H * 0.2);

    ctx.roundRect(
      this.checkboxX,
      this.checkboxY,
      this.checkboxSize,
      this.checkboxSize,
      2
    );
    ctx.fill();
    ctx.stroke();

    if (this._isChecked) {
      ctx.strokeStyle = this.checkboxColor;
      ctx.beginPath();
      ctx.moveTo(this.checkboxX + 3, this.checkboxY + this.checkboxSize / 2);
      ctx.lineTo(
        this.checkboxX + this.checkboxSize / 3,
        this.checkboxY + this.checkboxSize - 3
      );
      ctx.lineTo(this.checkboxX + this.checkboxSize - 3, this.checkboxY + 3);
      ctx.stroke();
    }
  }
}
