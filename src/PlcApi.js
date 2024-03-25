var PlcApi = function (graph) {
  var api = {
    loadGraph: function () {
      var graphJson = JSON.stringify(graph.serialize());

      var graphPayload = transformLiteGraphToMobject(JSON.parse(graphJson));

      console.log("Configuration Change");
      console.log();

      console.log(graphPayload);

      callRPC("CreateGraph", { graph: graphPayload })
        .then((result) => console.log("RPC result:", result))
        .catch((error) => console.error("RPC call failed:", error));
    },

    updateNodeProperty: function () {
      var graphJson = JSON.stringify(graph.serialize());

      var graphPayload = transformLiteGraphToMobject(JSON.parse(graphJson));

      console.log("Property Change");
      console.log();

      console.log(graphPayload);

      callRPC("CreateGraph", { graph: graphPayload })
        .then((result) => console.log("RPC result:", result))
        .catch((error) => console.error("RPC call failed:", error));
    },

    getStatus: function () {
      callRPC("GetStatus", { graphUuid: graph.uuid })
        .then((result) => {
          console.log(result);
          graph.updateStatus(result);
        })
        .catch((error) => console.error("RPC call failed:", error));
    },

    getBlueprints: function () {
      callRPC("GetBlueprints")
        .then((result) => console.log("RPC result:", result))
        .catch((error) => console.error("RPC call failed:", error));
    },
  };

  graph.onConfigurationHasChanged = function () {
    api.loadGraph();
  };

  graph.onPropertyHasChanged = function (node, name, value) {
    api.updateNodeProperty();
  };

  return api;
};
