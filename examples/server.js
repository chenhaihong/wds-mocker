const path = require("path");
const express = require("express");
const app = express();
const { createAttachMocker } = require("../");

const attachMocker = createAttachMocker({
  mockDir: path.resolve(__dirname, "mock"),
  onUrlencodedParser: true,
  onJsonBodyParser: true,
  onLogger: true,
  onWatcher: true,
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
