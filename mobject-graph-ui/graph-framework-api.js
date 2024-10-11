import { GraphFramework } from "../src/graph-framework.js";

export class GraphFrameworkApi {
  constructor(client, graphFramework = new GraphFramework()) {
    this.client = client;
    this.graphFramework = graphFramework;
  }

  async createGraph(graph) {
    console.log("api create graph", graph);
    return await this.client.callRPC("CreateGraph", {
      graph,
    });
  }

  async updateParameterValue(graphUuid, nodeId, parameterName, parameterValue) {
    console.log(
      "api update parameter, graphid:",
      graphUuid,
      "nodeId:",
      nodeId,
      "parameterName:",
      parameterName,
      "parameterValue:",
      parameterValue
    );
    return await this.client.callRPC("UpdateParameterValue", {
      graphUuid,
      nodeId,
      parameterName,
      parameterValue,
    });
  }

  async getStatus(graphUuid) {
    console.log("api get status", graphUuid);
    return await this.client.callRPC("GetStatus", { graphUuid });
  }

  getBlueprints() {
    console.log("api get blueprints");
    this.client
      .callRPC("GetBlueprints")
      .then((result) => {
        console.log("api get blueprints reply", result);
        this.graphFramework.installNodeBlueprints(result.blueprints);
      })
      .catch((error) => console.error("RPC call failed:", error));
  }
}
