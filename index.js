const express = require("express");
const browserSync = require("browser-sync");
const path = require("path");
const app = express();
const { AdsRpcClient } = require("mobject-client");

const client = new AdsRpcClient("127.0.0.1.1.1", 851, "Main.server");

const litegraphPath = path.join(__dirname, "litegraph.js");

const port = 8000; // or any port you prefe
app.use("/litegraph/css", express.static(path.join(litegraphPath, "css")));
app.use("/litegraph/src", express.static(path.join(litegraphPath, "build")));
app.use("/src", express.static("./src"));
app.use("/", express.static("./public"));

app.use(express.json());

app.listen(port, () =>
  console.log("Example app listening on http://127.0.0.1:8000")
);

app.post("/rpc/:methodName", async (req, res) => {
  const methodName = req.params.methodName;

  console.log(methodName, req.body);
  const params = req.body;

  try {
    await client.connect();
    const result = await client.rpcCall(methodName, params);
    res.json(result);
  } catch (error) {
    console.error(`Error calling RPC method ${methodName}:`, error);
    res.status(500).send(error);
  } finally {
    client.disconnect();
  }
});

browserSync.init({
  proxy: `localhost:${port}`,
  files: ["public/**/*.*", "src/**/*.*", "litegraph.js/*.*"],
  port: 5000,
  ui: { port: 5001 },
  notify: false,
});
