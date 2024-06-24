import { EventEmitter } from "../utils/EventEmitter.js";

export class ComboboxComponent {
  constructor(label, defaultValue, options, colorGenerator) {
    this.eventEmitter = new EventEmitter();
    this.label = label;
    this.options = options;
    this.colorGenerator = colorGenerator;
    this._selection = defaultValue;
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

  get selection() {
    return this._text;
  }

  set selection(value) {
    this._selection = value;
    this.eventEmitter.emit("onChange", this._selection);
  }

  on(eventName, listener) {
    this.eventEmitter.on(eventName, listener);
  }

  off(eventName, listener) {
    this.eventEmitter.off(eventName, listener);
  }

  onMouse(event, pos) {
    const component = this;
    if (event.type === "mousedown") {
      var ref_window = event.target.data.getCanvasWindow();
      var menu = new LiteGraph.ContextMenu(
        this.options,
        {
          scale: 1,
          event: event,
          className: "dark",
          callback: function (v) {
            component.selection = v;
          },
        },
        ref_window
      );
    }
  }

  computeSize() {
    let size = new Float32Array([60, 20]);
    var maxValueWidth = 0;

    this.options.forEach((optionsText) => {
      maxValueWidth = Math.max(
        maxValueWidth,
        LiteGraph.computeTextWidth(optionsText, 0.6)
      );
    });

    size[0] = maxValueWidth;
    size[0] += LiteGraph.computeTextWidth(this.label);
    size[0] += 70;
    size[1] = LiteGraph.NODE_WIDGET_HEIGHT;

    return size;
  }

  draw(ctx, node, widget_width, y, H) {
    ctx.textAlign = "left";
    const drawWidth = widget_width - this.margin * 2;
    this.drawBackground(ctx, y, drawWidth, H);
    this.drawLabel(ctx, y, H);
    this.drawValue(ctx, drawWidth, y, H);
    this.drawDownArrow(ctx, y, widget_width, H);
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

  drawDownArrow(ctx, y, widget_width, H) {
    ctx.fillStyle = this.arrowColor;
    ctx.beginPath();
    ctx.moveTo(widget_width - this.margin - 12, y + H - 5);
    ctx.lineTo(widget_width - this.margin - 18, y + 5);
    ctx.lineTo(widget_width - this.margin - 6, y + 5);
    ctx.fill();
  }

  drawValue(ctx, drawWidth, y, H) {
    ctx.font = this.valueFont;
    ctx.fillStyle = this.valueTextColor;
    ctx.textAlign = "right";
    ctx.fillText(this._selection, drawWidth - 5, y + H * 0.7);
  }
}
