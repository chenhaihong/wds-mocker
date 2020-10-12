const path = require("path");
const express = require("express");
const app = express();
const { createAttachMocker, createAttachUploader } = require("../");

app.use(
  express.static(path.resolve(__dirname, "public"), {
    index: "index.html",
  })
);

const dir = path.resolve(__dirname, "mock/api");
const attachMocker = createAttachMocker(dir, {
  onUrlencodedParser: true, // 启用UrlencodedParser，默认为true
  onJsonBodyParser: true, // 启用JsonBodyParser，默认为true
  onLogger: true, // 启用终端日志，默认为true
  onWatcher: true, // 启用watcher，监听变动，自动移除require.cache，默认为true
  onRouteParametersCapturer: true, // 启用路由参数捕获器，默认为false
});
attachMocker(app);

const dir2 = path.resolve(__dirname, "mock/uploadApi");
const attachUploader = createAttachUploader(dir2, {
  dest: path.resolve(__dirname, "public/uploads"),
  onLogger: true,
  onWatcher: true,
});
attachUploader(app);

app.use((err, req, res, next) => {
  if (err) {
    return res.send(err.message);
  }
  res.send("404");
});

const port = 3000;
app.listen(port, () =>
  console.log(`Listening on port http://localhost:${port} .`)
);
