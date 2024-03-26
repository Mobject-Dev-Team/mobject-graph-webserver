// abstract
class WidgetBase {
  _visible = true;
  _value = null;

  constructor() {
    if (new.target === WidgetBase) {
      throw new Error("Cannot instantiate an abstract class directly.");
    }
  }

  // abstract method
  onDraw() {
    throw new Error("Abstract method 'onDraw' not implemented.");
  }

  // abstract method
  onValueChanged() {
    throw new Error("Abstract method 'onDraw' not implemented.");
  }

  setValue(newValue) {
    if (newValue !== this._value) {
      const oldValue = this._value;
      this._value = newValue;
      this.dispatchEvent(
        new CustomEvent("valueChanged", { detail: { newValue, oldValue } })
      );
    }
  }

  draw(ctx, node, widget_width, y, H) {
    ctx.save();

    if (this.visible) {
      ctx.textAlign = "left";
      this.onDraw(ctx, node, widget_width, y, H);
    }

    ctx.restore();
  }

  mouse(event, pos, node) {
    if (!this._visible) {
      return true;
    }

    if (this.onMouse) {
      this.onMouse(event, pos, node);
    }

    return true;
  }

  hide() {
    this._visible = false;
  }

  show() {
    this._visible = true;
  }
}
