class StringDisplayWidget extends DisplayWidgetBase {
  constructor(name, content) {
    super(name, content);
    this.textDisplay = new SingleLineTextDisplayComponent(
      name,
      content.defaultValue,
      new ColorGenerator(content.datatype.typeName)
    );
  }

  onDisplayValueChanged(newValue, oldValue) {
    this.textDisplay.text = newValue;
  }

  computeSize() {
    return this.textDisplay.computeSize();
  }

  onDraw(ctx, node, widget_width, y, H) {
    this.textDisplay.draw(ctx, node, widget_width, y, H);
  }
}

class StringControlWidget extends ControlWidgetBase {
  constructor(name, property, parameter, content) {
    super(name, property, parameter, content);
    this.textInput = new SingleLineTextInputComponent(
      name,
      parameter.defaultValue,
      new ColorGenerator(parameter.datatype.typeName)
    );
    this.textInput.on("onChange", (text) => super.notifyChange(text));
  }

  onDisplayValueChanged(newValue, oldValue) {
    this.textInput.text = newValue;
  }

  computeSize() {
    return this.textInput.computeSize();
  }

  onMouse(event, pos, node) {
    this.textInput.onMouse(event, pos);
  }

  onDraw(ctx, node, widget_width, y, H) {
    this.textInput.draw(ctx, node, widget_width, y, H);
  }
}
