# wds-mocker

Mocker for express or wds.

**Example**

`webpack.config.js`

```javascript
module.exports = {
  devServer: {
    after(app) {
      const { createAttachMocker } = require("@erye/wds-mocker");
      const mockDir = path.resolve(__dirname, "mock");
      const attachMocker = createAttachMocker(mockDir, {
        onUrlencodedParser: true, // 启用UrlencodedParser，默认为true
        onJsonBodyParser: true, // 启用JsonBodyParser，默认为true
        onLogger: true, // 启用终端日志，默认为true
        onWatcher: true, // 启用watcher，监听变动，自动移除require.cache，默认为true
        onRouteParametersCapturer: true, // 启用路由参数捕获器，默认为false
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
    setTimeout(res, delay);
  });
};

module.exports = {
  // json对象
  "GET /json": { success: true, data: { message: "hello wds-mocker" } },

  //  pure function
  "GET /pureFunction": () => {
    return { success: true, data: { message: "pureFunction" } };
  },
  // pure function + 捕获路由参数
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
