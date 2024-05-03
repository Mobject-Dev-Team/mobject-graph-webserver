class EnumWidgetDrawer {
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

  drawValue(ctx, value, drawWidth, y, H) {
    ctx.font = this.valueFont;
    ctx.fillStyle = this.valueTextColor;
    ctx.textAlign = "right";
    ctx.fillText(value, drawWidth - 20, y + H * 0.7);
  }
}

class EnumDisplayWidget extends DisplayWidgetBase {
  constructor(name, content) {
    super(name, content);
    this.value = content.defaultValue;
    this.drawer = new EnumWidgetDrawer(name);
  }

  onDisplayValueChanged(newValue, oldValue) {
    this.value = newValue;
  }

  computeSize() {
    let size = new Float32Array([60, 20]);
    var maxValueWidth = 0;

    this.enums.forEach((enumText) => {
      maxValueWidth = Math.max(
        maxValueWidth,
        LiteGraph.computeTextWidth(enumText, 0.6)
      );
    });

    size[0] = maxValueWidth;
    size[0] += LiteGraph.computeTextWidth(this.label);
    size[0] += 70;
    size[1] = LiteGraph.NODE_WIDGET_HEIGHT;

    return size;
  }

  onDraw(ctx, node, widget_width, y, H) {
    this.drawer.draw(ctx, node, widget_width, y, H, this.value);
  }
}

class EnumControlWidget extends ControlWidgetBase {
  constructor(name, property, parameter, content) {
    super(name, property, parameter, content);
    this.value = parameter.defaultValue;
    this.drawer = new EnumWidgetDrawer(name);
    this.enums = parameter.datatype.enumerations;
  }

  onDisplayValueChanged(newValue, oldValue) {
    this.value = newValue;
    super.notifyChange(this.value);
  }

  computeSize() {
    let size = new Float32Array([60, 20]);
    var maxValueWidth = 0;

    this.enums.forEach((enumText) => {
      maxValueWidth = Math.max(
        maxValueWidth,
        LiteGraph.computeTextWidth(enumText, 0.6)
      );
    });

    size[0] = maxValueWidth;
    size[0] += LiteGraph.computeTextWidth(this.label);
    size[0] += 70;
    size[1] = LiteGraph.NODE_WIDGET_HEIGHT;

    return size;
  }

  onMouse(event, pos, node) {}

  onDraw(ctx, node, widget_width, y, H) {
    this.drawer.draw(ctx, node, widget_width, y, H, this.value);
  }
}
