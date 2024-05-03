class EnumDisplayWidget extends DisplayWidgetBase {
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

class EnumControlWidget extends ControlWidgetBase {
  constructor(name, property, parameter, content) {
    super(name, property, parameter, content);
    this.combobox = new ComboboxComponent(
      name,
      parameter.defaultValue,
      parameter.datatype.enumerations,
      new ColorGenerator(parameter.datatype.typeName)
    );
    this.combobox.on("onChange", (selection) => super.notifyChange(selection));
  }

  onDisplayValueChanged(newValue, oldValue) {
    this.combobox.selection = newValue;
  }

  computeSize() {
    return this.combobox.computeSize();
  }

  onMouse(event, pos, node) {
    this.combobox.onMouse(event, pos);
  }

  onDraw(ctx, node, widget_width, y, H) {
    this.combobox.draw(ctx, node, widget_width, y, H);
  }
}
