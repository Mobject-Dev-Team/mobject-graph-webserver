import { EventEmitter } from "../utils/EventEmitter.js";

export class SingleLineTextInputComponent {
  constructor(label, defaultValue, colorGenerator) {
    this.eventEmitter = new EventEmitter();
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
    this.eventEmitter.emit("onChange", this._text);
  }

  on(eventName, listener) {
    this.eventEmitter.on(eventName, listener);
  }

  off(eventName, listener) {
    this.eventEmitter.off(eventName, listener);
  }

  onMouse(event, pos) {
    const component = this;
    if (event.type === "pointerdown") {
      event.target.data.prompt(
        "Value",
        this._text,
        function (v) {
          component.text = v;
        },
        event
      );
    }
  }

  computeSize() {
    return new Float32Array([60, 20]);
  }

  draw(ctx, node, widget_width, y, H) {
    ctx.textAlign = "left";
    const drawWidth = widget_width - this.margin * 2;
    this.drawBackground(ctx, y, drawWidth, H);
    this.drawLabel(ctx, y, H);
    this.drawText(ctx, drawWidth, y, H);
  }

  drawBackground(ctx, y, drawWidth, H) {
    ctx.strokeStyle = this.outlineColor;
    ctx.fillStyle = this.backgroundColor;
    ctx.beginPath();
    ctx.roundRect(this.margin, y, drawWidth, H, 2);
    ctx.fill();
    ctx.stroke();
  }

  drawLabel(ctx, y, H) {
    ctx.font = this.labelFont;
    ctx.fillStyle = this.labelTextColor;
    ctx.fillText(this.label, this.margin + 10, y + H * 0.7);
  }

  drawText(ctx, drawWidth, y, H) {
    ctx.font = this.valueFont;
    ctx.fillStyle = this.valueTextColor;
    ctx.textAlign = "right";
    ctx.fillText(this._text, this.margin + drawWidth - 10, y + H * 0.7);
  }
}
