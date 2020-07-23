const path = require("path");
const express = require("express");
const app = express();
const { createMock } = require("../");

const mock = createMock({
  onUrlencoded: true,
  onJSONBodyParser: true,
  mockDir: path.resolve(__dirname, "mock"),
});
mock(app);

app.get("/", (req, res) => res.send("Hello World!"));
app.use((err, req, res, next) => {
  if (error) {
    return res.send(error.message);
  }
  next(new Error("404"));
});

const port = 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
