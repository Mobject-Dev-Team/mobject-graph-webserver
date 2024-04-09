class Node extends LGraphNode {
  parameters = new Parameters();
  contents = new Contents();

  constructor(title) {
    super(title);
  }

  update(status) {
    if (status && Array.isArray(status.contents)) {
      status.contents.forEach((contentStatus) => {
        const content = this.contents.getByName(contentStatus.name);
        if (content) {
          content.update(contentStatus);
        }
      });
    }
  }

  addContent(content) {
    this.contents.addByName(content.name, content);
    content.registerWithParent(this);
  }

  addParameter(parameter) {
    this.parameters.addByName(parameter.name, parameter);
    parameter.registerWithParent(this);
  }
}
