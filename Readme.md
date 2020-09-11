# wds-mocker

Mocker for express or wds.

**Example**

`webpack.config.js`

```javascript
module.exports = {
  devServer: {
    after(app) {
      const { createAttachMocker } = require("@erye/wds-mocker");
      const attachMocker = createAttachMocker({
        mockDir: path.resolve(__dirname, "mock"),
        onUrlencodedParser: true,
        onJsonBodyParser: true,
        onLogger: true,
        onWatcher: true,
      });
      attachMocker(app);
    },
  },
};
```

`mock/mock.js`

```javascript
const sleep = function (delay) {
  return new Promise((res) => {
    setTimeout(() => {
      res();
    }, delay);
  });
};

module.exports = {
  // json对象
  "GET /json": {
    success: true,
    data: { message: "hello wds-mocker 123" },
  },

  //  pure function + 动态路由
  "GET /pureFunction": () => {
    return { success: true, data: { message: "pureFunction" } };
  },
  // pure function + 动态路由
  "GET /pureFunction/:id": (req) => {
    const { params, query } = req;
    return { success: true, data: { message: "pureFunction", params, query } };
  },

  // 异步
  "GET /async": async () => {
    await sleep(2000);
    return { success: true, data: { message: "async" } };
  },
};
```
