class WidgetBase {
  options = { property: "" }; // Placeholder for required structure in litegraph
  visible = true;
  parentNode = null;

  constructor(name) {
    this._ensureNotAbstract(WidgetBase, new.target);
    this.name = name;
  }

  registerWithParent(node) {
    this.parentNode = node;
  }

  unregisterWithParent() {
    this.parentNode = null;
  }

  draw(ctx, node, widgetWidth, y, H) {
    ctx.save();
    if (this.visible) {
      this.onDraw(ctx, node, widgetWidth, y, H);
    }
    ctx.restore();
  }

  mouse(event, pos, node) {
    if (!this.visible) return false;
    return this.onMouse?.(event, pos, node) ?? true;
  }

  hide() {
    this.visible = false;
  }

  show() {
    this.visible = true;
  }

  onDraw(ctx, node, widgetWidth, y, H) {
    this._abstractMethodError("onDraw");
  }

  _ensureNotAbstract(cls, target) {
    if (cls === target) {
      throw new TypeError(
        `${cls.name} is an abstract class and cannot be instantiated directly.`
      );
    }
  }

  _abstractMethodError(method) {
    throw new Error(
      `Abstract method '${method}' must be implemented by subclasses.`
    );
  }
}

export class DisplayWidgetBase extends WidgetBase {
  _previousValue = null;
  static capability = "display";

  constructor(name, content) {
    super(name);
    this._ensureNotAbstract(DisplayWidgetBase, new.target);
    this.content = content;
    this.boundHandleNodeUpdatedEvent = this.handleNodeUpdatedEvent.bind(this);
  }

  registerWithParent(parentNode) {
    super.registerWithParent(parentNode);
    if (this.content) {
      parentNode.on("nodeUpdated", this.boundHandleNodeUpdatedEvent);
    }
  }

  unregisterWithParent() {
    super.unregisterWithParent();
    if (this.parentNode) {
      this.parentNode.off("nodeUpdated", this.boundHandleNodeUpdatedEvent);
    }
  }

  handleNodeUpdatedEvent(status) {
    const value = status.contents?.find(
      (content) => content.name === this.content.name
    )?.value;
    if (value !== undefined) {
      this.update(value);
    }
  }

  update(newValue) {
    if (newValue !== this._previousValue) {
      const previousValue = this._previousValue;
      this._previousValue = newValue;
      this.onDisplayValueChanged(newValue, previousValue);
      this.parentNode?.setDirtyCanvas(true, true);
    }
  }

  onDisplayValueChanged(newValue, oldValue) {
    this._abstractMethodError("onDisplayValueChanged");
  }
}

export class ControlWidgetBase extends DisplayWidgetBase {
  static capability = "control";

  constructor(name, property, content) {
    super(name, content);
    this._ensureNotAbstract(ControlWidgetBase, new.target);
    this.property = property;
  }

  notifyChange(value) {
    this.parentNode?.setProperty(this.property.name, value);
  }
}
