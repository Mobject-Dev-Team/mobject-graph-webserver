class WidgetBase {
  options = { property: "" }; // this is required for litegraph, but is unused.
  visible = true;
  size = new Float32Array([0, 0]);
  parentNode = null;

  constructor(name) {
    if (new.target === WidgetBase) {
      throw new Error("Cannot instantiate an abstract class directly.");
    }
    this.name = name;
  }

  registerWithParent(node) {
    this.parentNode = node;
  }

  unregisterWithParent(node) {
    this.parentNode = null;
  }

  onDraw(ctx, node, widget_width, y, H) {
    throw new Error("Abstract method 'onDraw' not implemented.");
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

class DisplayWidgetBase extends WidgetBase {
  constructor(name, content) {
    if (new.target === DisplayWidgetBase) {
      throw new Error("Cannot instantiate an abstract class directly.");
    }
    super(name);
    this.content = content;
  }
  displayValue = null;
  static capability = "display";

  registerWithParent(parentNode) {
    super.registerWithParent(parentNode);

    if (this.content) {
      parentNode.on("nodeUpdated", (status) => {
        const value = status.contents?.find(
          (content) => content.name === this.content.name
        )?.value;
        if (value !== undefined) {
          this.update(value);
        }
      });
    }
  }

  unregisterWithParent(parentNode) {
    super.unregisterWithParent(parentNode);
    parentNode.off("nodeUpdated");
  }

  update(newValue) {
    if (newValue !== this.displayValue) {
      const oldValue = this.displayValue;
      this.displayValue = newValue;
      this.onDisplayValueChanged(newValue, oldValue);
      if (this.parentNode) {
        this.parentNode.setDirtyCanvas(true, true);
      }
    }
  }

  onDisplayValueChanged(newValue, oldValue) {
    throw new Error("Abstract method 'onValueChanged' not implemented.");
  }
}

class ControlWidgetBase extends DisplayWidgetBase {
  constructor(name, property, parameter, content) {
    if (new.target === ControlWidgetBase) {
      throw new Error("Cannot instantiate an abstract class directly.");
    }
    super(name);
    this.property = property;
  }
  static capability = "control";

  onDisplayValueChanged(newValue, oldValue) {}

  notifyChange(value) {
    if (this.parentNode) {
      this.parentNode.setProperty(this.property.name, value);
    }
  }
}
