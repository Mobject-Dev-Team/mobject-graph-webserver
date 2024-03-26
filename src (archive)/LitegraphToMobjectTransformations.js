function convertNodeIdsToStrings(nodes) {
  return nodes.map((node) => ({
    ...node,
    id: String(node.id),
    type: convertTypeToSpecialString(node.type),
  }));
}

function transformLinks(nodes, links) {
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

function convertTypeToSpecialString(typeStr) {
  return typeStr
    .split("/") // Split by slash to handle each segment separately
    .map(
      (segment) =>
        segment
          .split(" ") // Split by space to handle words within the segment
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          ) // Convert to PascalCase
          .join("") // Join the words back together
    )
    .join("."); // Join the segments with a period
}

function transformLiteGraphToMobject(liteGraphData) {
  // First, convert node IDs to strings
  const nodesWithConvertedIds = convertNodeIdsToStrings(liteGraphData.nodes);

  // Then, transform the links
  const transformedLinks = transformLinks(
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
