const express = require("express");
const browserSync = require("browser-sync");
const path = require("path");
const app = express();
const { AdsRpcClient } = require("mobject-client");
require("dotenv").config();

const defaultNetId = "127.0.0.1.1.1";
const client = new AdsRpcClient(
  process.env.NET_ID || defaultNetId,
  851,
  "Main.server"
);
const litegraphPath = path.join(__dirname, "litegraph.js");
const port = 8000;

app.use(express.json({ limit: "50mb" }));

app.use("/litegraph/css", express.static(path.join(litegraphPath, "css")));
app.use("/litegraph/src", express.static(path.join(litegraphPath, "src")));
app.use("/src", express.static("./mobject-graph-ui"));
app.use("/src", express.static("./mobject-graph-ui-vision-pack"));
app.use("/", express.static("./public"));
app.use(express.json());

client.connect().catch((error) => {
  console.error("Initial connection to RPC server failed:", error);
});

app.listen(port, () => console.log("Listening on http://127.0.0.1:" + port));

process.on("SIGINT", () => {
  console.log("Disconnecting from RPC server...");
  client
    .disconnect()
    .then(() => {
      console.log("Disconnected");
    })
    .finally(() => {
      process.exit(0);
    });
});

app.post("/rpc/:methodName", async (req, res, next) => {
  const methodName = req.params.methodName;
  const params = req.body || {};

  try {
    if (!client.isConnected) {
      await client.connect();
    }
    const result = await client.rpcCall(methodName, params);
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

browserSync.init({
  proxy: `localhost:${port}`,
  files: ["public/**/*.*", "mobject-graph-ui/**/*.*", "litegraph.js/*.*"],
  port: 5000,
  ui: { port: 5001 },
  notify: false,
});
