export class MobjectGraphTransformer {
  // Public method to be used by class consumers
  static Convert(graph) {
    const liteGraphData = JSON.parse(JSON.stringify(graph.serialize()));
    // First, convert node IDs to strings
    const nodesWithConvertedIds = this.#convertNodeIdsToStrings(
      liteGraphData.nodes
    );

    // Then, transform the links
    const transformedLinks = this.#transformLinks(
      nodesWithConvertedIds,
      liteGraphData.links
    );

    // Return the transformed data with nodes and links processed
    return {
      ...liteGraphData,
      nodes: nodesWithConvertedIds,
      links: transformedLinks,
    };
  }

  // Private method to convert node IDs to strings
  static #convertNodeIdsToStrings(nodes) {
    return nodes.map((node) => ({
      ...node,
      id: String(node.id),
    }));
  }

  // Private method to transform links
  static #transformLinks(nodes, links) {
    return links.map((link) => {
      const [
        linkId,
        sourceNodeId,
        sourceOutputIndex,
        targetNodeId,
        targetInputIndex,
        type,
      ] = link;

      const linkIdStr = String(linkId);
      const sourceNodeIdStr = String(sourceNodeId);
      const targetNodeIdStr = String(targetNodeId);

      const sourceNode = nodes.find((node) => node.id === sourceNodeIdStr);
      const targetNode = nodes.find((node) => node.id === targetNodeIdStr);

      const sourceOutputName = sourceNode
        ? sourceNode.outputs[sourceOutputIndex]?.name || "unknown"
        : "unknown";
      const targetInputName = targetNode
        ? targetNode.inputs[targetInputIndex]?.name || "unknown"
        : "unknown";

      return [
        linkIdStr,
        sourceNodeIdStr,
        sourceOutputName,
        targetNodeIdStr,
        targetInputName,
        type,
      ];
    });
  }
}
