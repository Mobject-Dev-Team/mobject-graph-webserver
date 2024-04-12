const express = require("express");
const browserSync = require("browser-sync");
const path = require("path");
const app = express();
const { AdsRpcClient } = require("mobject-client");
const ads = require("ads-client");

const client = new AdsRpcClient("127.0.0.1.1.1", 851, "Main.server");
// const client = new AdsRpcClient("192.168.4.1.1.1", 851, "Main.server");
// const client = new AdsRpcClient("5.68.118.43.1.1", 851, "Main.server");

const litegraphPath = path.join(__dirname, "litegraph.js");
const port = 8000;

app.use("/litegraph/css", express.static(path.join(litegraphPath, "css")));
app.use("/litegraph/src", express.static(path.join(litegraphPath, "src")));
app.use("/src", express.static("./src"));
app.use("/", express.static("./public"));
app.use(express.json());

client
  .connect()
  .then(() => {
    console.log("Connected to RPC server");
    app.listen(port, () =>
      console.log("Example app listening on http://127.0.0.1:" + port)
    );
  })
  .catch((error) => {
    console.error("Failed to connect to RPC server:", error);
    process.exit(1);
  });

process.on("SIGINT", () => {
  console.log("Disconnecting from RPC server...");
  client.disconnect().then(() => {
    console.log("Disconnected");
    process.exit(0);
  });
});

app.post("/rpc/:methodName", async (req, res) => {
  const methodName = req.params.methodName;
  // console.log(methodName);
  // console.log(JSON.stringify(req.body));
  const params = req.body;

  if (typeof params !== "object" || params === null) {
    return res.status(400).send("Invalid parameters");
  }

  try {
    const result = await client.rpcCall(methodName, params);
    res.json(result);
  } catch (error) {
    console.error(`Error calling RPC method ${methodName}:`, error);
    res.status(500).send(error);
  }
});

app.post("/assets/getAssets", async (req, res) => {
  // check users assets directory,
  // return node blueprints for asset collection.
});

browserSync.init({
  proxy: `localhost:${port}`,
  files: ["public/**/*.*", "src/**/*.*", "litegraph.js/*.*"],
  port: 5000,
  ui: { port: 5001 },
  notify: false,
});
