class WidgetBase {
  options = { property: "" }; // this is required for litegraph, but is unused.
  visible = true;
  size = new Float32Array([0, 0]);
  parent = null;

  constructor(name) {
    if (new.target === WidgetBase) {
      throw new Error("Cannot instantiate an abstract class directly.");
    }
    this.name = name;
  }

  registerWithParent(node) {
    this.parent = node;
  }

  unregisterWithParent(node) {
    this.parent = null;
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

  registerWithParent(node) {
    super.registerWithParent(node);

    if (this.content) {
      node.on("nodeUpdated", (status) => {
        const value = status.contents?.find(
          (content) => content.name === this.content.name
        )?.value;
        if (value !== undefined) {
          this.update(value);
        } else {
          console.log("Content by this name not found or value is undefined.");
        }
      });
    }
  }

  unregisterWithParent(node) {
    super.registerWithParent(node);
    node.off("nodeUpdated");
  }

  update(newValue) {
    if (newValue !== this.displayValue) {
      const oldValue = this.displayValue;
      this.displayValue = newValue;
      this.onDisplayValueChanged(newValue, oldValue);
      if (this.parent) {
        this.parent.setDirtyCanvas(true, true);
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
    if (this.parent) {
      this.parent.setProperty(this.property.name, value);
    }
  }
}
