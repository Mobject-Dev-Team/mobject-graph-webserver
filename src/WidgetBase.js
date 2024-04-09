// abstract
class WidgetBase {
  _value = null;
  visible = true;
  size = new Float32Array([0, 0]);

  constructor(name, options) {
    if (new.target === WidgetBase) {
      throw new Error("Cannot instantiate an abstract class directly.");
    }

    this.size = new Float32Array([0, 0]);
  }

  // abstract method
  onDraw(ctx, node, widget_width, y, H) {
    throw new Error("Abstract method 'onDraw' not implemented.");
  }

  // abstract method
  onValueChanged(newValue, oldValue) {
    throw new Error("Abstract method 'onValueChanged' not implemented.");
  }

  setValue(newValue) {
    if (newValue !== this._value) {
      const oldValue = this._value;
      this._value = newValue;
      this.onValueChanged(newValue, oldValue);
    }
  }

  draw(ctx, node, widget_width, y, H) {
    ctx.save();

    if (this.visible) {
      this.onDraw(ctx, node, widget_width, y, H);
    }

    ctx.restore();
  }

  mouse(event, pos, node) {
    if (!this.visible) {
      return true;
    }

    if (this.onMouse) {
      this.onMouse(event, pos, node);
    }

    return true;
  }

  hide() {
    this.visible = false;
  }

  show() {
    this.visible = true;
  }
}
