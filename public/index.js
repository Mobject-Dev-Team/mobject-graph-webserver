import { GraphFramework } from "../src/graph-framework.js";
import { DefaultPack } from "../src/packs/default-pack.js";
import { VisionPack } from "../src/vision-pack.js";

import { FetchRpcClient } from "../src/fetch-rpc-client.js";
import { GraphFrameworkApi } from "../src/graph-framework-api.js";
import { GraphEditor } from "../src/graph-editor.js";

var graphFramework = new GraphFramework();
graphFramework.install(DefaultPack);
graphFramework.install(VisionPack);

var client = new FetchRpcClient();
var api = new GraphFrameworkApi(client, graphFramework);

var graph = new GraphEditor(
  {
    containerSelector: "#my-editor",
    width: 800,
    height: 600,
  },
  api
);

window.graph = graph;

document.getElementById("getBlueprintsBtn").addEventListener("click", () => {
  api.getBlueprints();
});
