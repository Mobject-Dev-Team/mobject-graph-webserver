class NodeBase extends LGraphNode {
  parameters = new Parameters();
  contents = new Contents();

  constructor(title) {
    super(title);
  }

  update(nodeStatus) {
    nodeStatus.contents.forEach((contentStatus) => {
      const content = this.contents.getContentByName(contentStatus.name);
      if (content) {
        content.update(contentStatus);
      }
    });
  }

  addContent(content) {
    this.contents.addContentByName(content.name, content);
  }

  addParameter(parameter) {
    this.parameters.addParameterByName(parameter.name, parameter);
  }
}
