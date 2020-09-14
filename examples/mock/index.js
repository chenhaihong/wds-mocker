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
