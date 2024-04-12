class BooleanControlWidget extends ControlWidgetBase {
  constructor(name, property, parameter, content) {
    super(name, property, parameter, content);
    this.value = parameter.defaultValue;
    this.labelFont = "12px Arial";
    this.valueFont = "12px Arial";
    this.margin = 20;
    this.outline_color = "#666";
    this.background_color = "#222";
    this.text_color = "#ddd";
    this.secondary_text_color = "#999";
    this.value_color = "#ddd";
    this.secondary_value_color = "#555555";
    this.label = name;
  }

  onDisplayValueChanged(newValue, oldValue) {
    this.value = newValue;
  }

  computeSize() {
    this.size[0] = 60;
    this.size[1] = 20;

    return this.size;
  }

  onMouse(event, pos, node) {
    if (event.type == "mousedown") {
      this.value = !this.value;
      super.notifyChange(this.value);
    }
  }

  onDraw(ctx, node, widget_width, y, H) {
    ctx.textAlign = "left";

    var drawWidth = widget_width - this.margin * 2;

    // draw the outline
    ctx.strokeStyle = this.outline_color;
    ctx.fillStyle = this.background_color;
    ctx.beginPath();
    ctx.roundRect(this.margin, y, drawWidth, H, H * 0.5);
    ctx.fill();
    ctx.stroke();

    // draw the status circle
    ctx.fillStyle = this.value ? "#89A" : "#333";
    ctx.beginPath();
    ctx.arc(drawWidth + 4, y + H * 0.5, H * 0.25, 0, Math.PI * 2);
    ctx.fill();

    // draw the label text
    ctx.font = this.labelFont;
    ctx.fillStyle = this.secondary_text_color;
    if (this.label != null) {
      ctx.fillText(this.label, this.margin * 2 + 5, y + H * 0.7);
    }

    // draw the value text
    ctx.font = this.valueFont;
    ctx.fillStyle = this.value ? this.value_color : this.secondary_text_color;
    ctx.textAlign = "right";
    ctx.fillText(this.value ? "true" : "false", drawWidth - 20, y + H * 0.7);
  }
}
