import { Graph } from "./graph.js";
import { LGraphCanvas } from "/litegraph/src/lgraphcanvas.js";
import { MobjectGraphTransformer } from "./utils/litegraph-converter.js";

export class GraphEditor {
  constructor({ containerSelector, width = 800, height = 600 }, connection) {
    this.statusTimeout = null;
    this.connection = connection;
    this.setupContainer(containerSelector);
    this.setupCanvas(width, height);
    return this.initializeGraph();
  }

  setupContainer(containerSelector) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) {
      throw new Error(
        `Container element with selector "${containerSelector}" not found`
      );
    }
  }

  setupCanvas(width, height) {
    // Create and configure the canvas element
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    this.container.appendChild(this.canvas);
  }

  initializeGraph() {
    // Create and initialize the graph and canvas
    const graph = new Graph();
    new LGraphCanvas(this.canvas, graph);
    this.graph = graph;

    this.graph.registerCallbackHandler(
      "onConnectionChange",
      async (oCbInfo, node) => {
        await this.callCreateGraph();
      }
    );

    this.graph.registerCallbackHandler("onNodeAdded", async (oCbInfo, node) => {
      node.registerCallbackHandler(
        "onPropertyChanged",
        async (oCbInfo, name, value, prevValue) => {
          try {
            const reply = await this.connection.updateParameterValue(
              this.graph.uuid,
              node.id,
              name,
              value
            );
            console.log(reply);
          } catch (e) {
            console.log(e);
          }
        }
      );

      await this.callCreateGraph();
    });

    this.graph.registerCallbackHandler(
      "onNodeRemoved",
      async (oCbInfo, node) => {
        await this.callCreateGraph();
      }
    );

    return graph;
  }

  async callCreateGraph() {
    try {
      const graphPayload = MobjectGraphTransformer.Convert(this.graph);
      console.log(graphPayload);
      const status = await this.connection.createGraph(graphPayload);
      console.log(status);
      this.graph.update(status);
      this.startStatusUpdates();
    } catch (e) {
      console.log(e);
    }
  }

  startStatusUpdates() {
    this.stopStatusUpdates();
    this.scheduleNextUpdate();
  }

  stopStatusUpdates() {
    if (this.statusTimeout) {
      clearTimeout(this.statusTimeout);
      this.statusTimeout = null;
    }
  }

  scheduleNextUpdate() {
    this.statusTimeout = setTimeout(async () => {
      try {
        const status = await this.connection.getStatus(this.graph.uuid);
        this.graph.update(status);
        this.scheduleNextUpdate();
      } catch (error) {
        console.log(error);
        this.stopStatusUpdates();
      }
    }, 500);
  }
}
