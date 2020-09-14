const path = require("path");
const express = require("express");
const app = express();
const { createAttachMocker } = require("../");

const mockDir = path.resolve(__dirname, "mock");
const attachMocker = createAttachMocker(mockDir, {
  onUrlencodedParser: true, // 启用UrlencodedParser，默认为true
  onJsonBodyParser: true, // 启用JsonBodyParser，默认为true
  onLogger: true, // 启用终端日志，默认为true
  onWatcher: true, // 启用watcher，监听变动，自动移除require.cache，默认为true
  onRouteParametersCapturer: true, // 启用路由参数捕获器，默认为false
});
attachMocker(app);

app.get("/", (req, res) => res.send("Hello World!"));
app.use((err, req, res, next) => {
  if (err) {
    return res.send(err.message);
  }
  res.send("404");
});

const port = 3000;
app.listen(port, () => console.log(`Listening on port ${port}!`));
