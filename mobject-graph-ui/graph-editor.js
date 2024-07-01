import { Graph } from "./graph.js";
import { LGraphCanvas } from "/litegraph/src/lgraphcanvas.js";

export class GraphEditor {
  constructor({ containerSelector, width = 800, height = 600 }, connection) {
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
    return graph;
  }
}
