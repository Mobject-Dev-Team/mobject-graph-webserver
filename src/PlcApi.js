class PlcApi {
  constructor(graph, graphFramework) {
    this.graph = graph;
    this.graphFramework = graphFramework;
    this.transformer = new MobjectGraphTransformer();

    this.graph.on("configurationChanged", this.loadGraph.bind(this));
  }

  loadGraph() {
    const graphJson = JSON.stringify(this.graph.serialize());
    const graphPayload = this.transformer.transformLiteGraphToMobject(
      JSON.parse(graphJson)
    );

    console.log("Configuration Change");
    console.log(graphPayload);

    callRPC("CreateGraph", { graph: graphPayload })
      .then((result) => console.log("RPC result:", result))
      .catch((error) => console.error("RPC call failed:", error));
  }

  getStatus() {
    callRPC("GetStatus", { graphUuid: this.graph.uuid })
      .then((result) => {
        console.log(result);
        this.graph.update(result);
      })
      .catch((error) => console.error("RPC call failed:", error));
  }

  getBlueprints() {
    callRPC("GetBlueprints")
      .then((result) => {
        console.log("RPC result:", result);
        this.graphFramework.installNodeBlueprints(result.blueprints);
      })
      .catch((error) => console.error("RPC call failed:", error));
  }
}
