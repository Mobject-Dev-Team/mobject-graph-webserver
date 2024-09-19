import { GraphFramework } from "../src/graph-framework.js";

export class GraphFrameworkApi {
  constructor(client, graphFramework = new GraphFramework()) {
    this.client = client;
    this.graphFramework = graphFramework;
  }

  async createGraph(graph) {
    console.log(graph);
    return await this.client.callRPC("CreateGraph", {
      graph,
    });
  }

  async updateParameterValue(graphUuid, nodeId, parameterName, parameterValue) {
    return await this.client.callRPC("UpdateParameterValue", {
      graphUuid,
      nodeId,
      parameterName,
      parameterValue,
    });
  }

  async getStatus(graphUuid) {
    return await this.client.callRPC("GetStatus", { graphUuid });
  }

  getBlueprints() {
    this.client
      .callRPC("GetBlueprints")
      .then((result) => {
        console.log(result);
        this.graphFramework.installNodeBlueprints(result.blueprints);
      })
      .catch((error) => console.error("RPC call failed:", error));
  }
}
