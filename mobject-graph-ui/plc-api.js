import { MobjectGraphTransformer } from "./litegraph-converter.js";
import { callRPC } from "./server-rpc-call.js";

export class PlcApi {
  constructor(graph, graphFramework) {
    this.graph = graph;
    this.graphFramework = graphFramework;
    this.transformer = new MobjectGraphTransformer();
    this.statusTimeout = null;

    function debounceAndThrottle(func, wait) {
      let timeout = null;
      let lastArgs = null;

      const later = () => {
        if (lastArgs !== null) {
          func(...lastArgs);
          lastArgs = null;
          timeout = setTimeout(later, wait); // Re-establish the timeout for trailing edge
        } else {
          timeout = null;
        }
      };

      return function (...args) {
        if (!timeout) {
          func(...args); // Execute immediately on leading edge
          timeout = setTimeout(later, wait);
        } else {
          lastArgs = args; // Store the most recent arguments for the trailing edge call
        }
      };
    }

    // Apply the custom debounce and throttle function to the event listener
    this.graph.on(
      "configurationChanged",
      debounceAndThrottle(this.loadGraph.bind(this), 500)
    );

    // this.graph.on("configurationChanged", this.loadGraph.bind(this));

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
    // Clear any existing timeout to prevent duplicates
    this.stopStatusUpdates();

    // Initialize the status updates
    this.scheduleNextUpdate();
  }

  stopStatusUpdates() {
    if (this.statusTimeout) {
      clearTimeout(this.statusTimeout);
      this.statusTimeout = null;
    }
  }

  scheduleNextUpdate() {
    console.log("scheduleNextUpdate");
    this.statusTimeout = setTimeout(() => {
      this.getStatus();
    }, 500);
  }

  getStatus() {
    callRPC("GetStatus", { graphUuid: this.graph.uuid })
      .then((result) => {
        // console.log("Status:", result);
        this.graph.update(result);
        this.scheduleNextUpdate();
      })
      .catch((error) => {
        console.error("RPC call failed:", error);
        this.stopStatusUpdates();
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
