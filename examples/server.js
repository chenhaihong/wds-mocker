const path = require("path");
const express = require("express");
const app = express();
const { createAttachMocker } = require("../");

const attachMocker = createAttachMocker({
  onUrlencoded: true,
  onJSONBodyParser: true,
  mockDir: path.resolve(__dirname, "mock"),
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
