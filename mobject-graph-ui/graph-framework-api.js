import { GraphFramework } from "../src/graph-framework.js";

export class GraphFrameworkApi {
  constructor(client) {
    this.client = client;
  }

  async createGraph(graph) {
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

  getBlueprints(graphFramework = new GraphFramework()) {
    this.client
      .callRPC("GetBlueprints")
      .then((result) => {
        graphFramework.installNodeBlueprints(result.blueprints);
      })
      .catch((error) => console.error("RPC call failed:", error));
  }
}
