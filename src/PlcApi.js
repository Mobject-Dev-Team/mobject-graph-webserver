class PlcApi {
  constructor(graph, graphFramework) {
    this.graph = graph;
    this.graphFramework = graphFramework;
    this.transformer = new MobjectGraphTransformer();

    this.graph.on("configurationChanged", this.loadGraph.bind(this));

    this.statusInterval = null; // Store the interval ID for clearing later
  }

  loadGraph() {
    const graphJson = JSON.stringify(this.graph.serialize());
    const graphPayload = this.transformer.transformLiteGraphToMobject(
      JSON.parse(graphJson)
    );

    // console.log("Configuration Change");
    console.log(graphPayload);

    callRPC("CreateGraph", {
      graph: graphPayload,
    })
      .then((result) => {
        // console.log("RPC result:", result);
        this.startStatusUpdates(); // Start the status updates when loadGraph is successful
      })
      .catch((error) => {
        console.error("RPC call failed:", error);
        this.stopStatusUpdates(); // Ensure no updates are called if the load fails
      });
  }

  startStatusUpdates() {
    // Clear any existing interval to prevent duplicates
    if (this.statusInterval) {
      clearInterval(this.statusInterval);
    }

    // Call getStatus every 0.5 seconds
    this.statusInterval = setInterval(() => {
      this.getStatus();
    }, 100);
  }

  stopStatusUpdates() {
    if (this.statusInterval) {
      clearInterval(this.statusInterval);
      this.statusInterval = null;
    }
  }

  getStatus() {
    callRPC("GetStatus", { graphUuid: this.graph.uuid })
      .then((result) => {
        // console.log("Status:", result);
        this.graph.update(result);
      })
      .catch((error) => {
        console.error("RPC call failed:", error);
        this.stopStatusUpdates(); // Optionally stop updates on error
      });
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
