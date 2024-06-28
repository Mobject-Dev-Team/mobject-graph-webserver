import { IecDatatypesPack } from "../src/iec-datatypes-pack.js";
import { VisionPack } from "../src/vision-pack.js";
import { GraphFramework } from "../src/graph-framework.js";
import { GraphCanvas } from "../src/graph-canvas.js";
import { PlcApi } from "../src/plc-api.js";

var iecDatatypesPack = new IecDatatypesPack();
var visionPack = new VisionPack();
var graphFramework = new GraphFramework();

graphFramework.install(iecDatatypesPack);
graphFramework.install(visionPack);

var graph = graphFramework.create();
new GraphCanvas("#mycanvas", graph);
var api = new PlcApi(graph, graphFramework);

document.getElementById("getBlueprintsBtn").addEventListener("click", () => {
  api.getBlueprints();
});
