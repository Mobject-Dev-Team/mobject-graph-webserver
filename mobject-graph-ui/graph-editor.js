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

    this.graph.on("configurationChanged", async () => {
      try {
        const graphPayload = MobjectGraphTransformer.Convert(this.graph);

        await this.connection.loadGraph(graphPayload);
        this.startStatusUpdates();
      } catch (e) {
        console.log(e);
      }
    });

    return graph;
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
        console.log("get");
        const status = await this.connection.getStatus(this.graph.uuid);
        this.graph.update(status);
        this.scheduleNextUpdate();
      } catch (e) {
        console.log(e);
      }
    }, 500);
  }
}
