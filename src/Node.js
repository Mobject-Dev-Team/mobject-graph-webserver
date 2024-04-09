class Node extends LGraphNode {
  constructor(title) {
    super(title);
  }

  update(status) {
    // if (status && Array.isArray(status.contents)) {
    //   status.contents.forEach((contentStatus) => {
    //     const content = this.contents.getByName(contentStatus.name);
    //     if (content) {
    //       content.update(contentStatus);
    //     }
    //   });
    // }
  }
}
