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
    data: { message: "json" },
  },

  // pure function
  "GET /pureFunction": ({ method, path, params, query, body }) => {
    return {
      success: true,
      data: { message: "pureFunction", method, path, params, query, body },
    };
  },
  "GET /pureFunction/:id": ({ method, path, params, query, body }) => {
    return {
      success: true,
      data: { message: "pureFunction", method, path, params, query, body },
    };
  },

  // 异步
  "GET /async": async ({ method, path, params, query, body }) => {
    await sleep(2000);

    return {
      success: true,
      data: { message: "async", method, path, params, query, body },
    };
  },
};
