class BooleanWidgetDrawer {
  constructor(label) {
    this.label = label;
    this.labelFont = "12px Arial";
    this.labelTextColor = "#999";
    this.valueFont = "12px Arial";
    this.valueTextColor = "#ddd";
    this.margin = 20;
    this.outlineColor = "#666";
    this.backgroundColor = "#222";
    this.trueIndicatorColor = "#39e75f";
    this.falseIndicatorColor = "#333";
  }

  draw(ctx, node, widget_width, y, H, value) {
    ctx.textAlign = "left";
    const drawWidth = widget_width - this.margin * 2;
    this.drawBackground(ctx, y, drawWidth, H);
    this.drawLabel(ctx, y, H);
    this.drawValue(ctx, value, drawWidth, y, H);
    this.drawIndicator(ctx, value, drawWidth, y, H);
  }

  drawBackground(ctx, y, drawWidth, H) {
    ctx.strokeStyle = this.outlineColor;
    ctx.fillStyle = this.backgroundColor;
    ctx.beginPath();
    ctx.roundRect(this.margin, y, drawWidth, H, H * 0.5);
    ctx.fill();
    ctx.stroke();
  }

  drawLabel(ctx, y, H) {
    ctx.font = this.labelFont;
    ctx.fillStyle = this.labelTextColor;
    ctx.fillText(this.label, this.margin * 2 + 5, y + H * 0.7);
  }

  drawValue(ctx, value, drawWidth, y, H) {
    ctx.font = this.valueFont;
    ctx.fillStyle = this.valueTextColor;
    ctx.textAlign = "right";
    ctx.fillText(value ? "true" : "false", drawWidth - 20, y + H * 0.7);
  }

  drawIndicator(ctx, value, drawWidth, y, H) {
    ctx.fillStyle = value ? this.trueIndicatorColor : this.falseIndicatorColor;
    ctx.beginPath();
    ctx.arc(drawWidth + 4, y + H * 0.5, H * 0.25, 0, Math.PI * 2);
    ctx.fill();
  }
}

class BooleanDisplayWidget extends DisplayWidgetBase {
  constructor(name, content) {
    super(name, content);
    this.value = content.defaultValue;
    this.drawer = new BooleanWidgetDrawer(name);
  }

  onDisplayValueChanged(newValue, oldValue) {
    this.value = newValue;
  }

  computeSize() {
    return new Float32Array([60, 20]);
  }

  onDraw(ctx, node, widget_width, y, H) {
    this.drawer.draw(ctx, node, widget_width, y, H, this.value);
  }
}

class BooleanControlWidget extends ControlWidgetBase {
  constructor(name, property, parameter, content) {
    super(name, property, parameter, content);
    this.value = parameter.defaultValue;
    this.drawer = new BooleanWidgetDrawer(name);
  }

  onDisplayValueChanged(newValue, oldValue) {
    this.value = newValue;
    super.notifyChange(this.value);
  }

  computeSize() {
    return new Float32Array([60, 20]);
  }

  onMouse(event, pos, node) {
    if (event.type == "mousedown") {
      this.value = !this.value;
      super.notifyChange(this.value);
    }
  }

  onDraw(ctx, node, widget_width, y, H) {
    this.drawer.draw(ctx, node, widget_width, y, H, this.value);
  }
}
