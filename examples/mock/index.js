const sleep = function (delay) {
  return new Promise((res) => {
    setTimeout(() => {
      res();
    }, delay);
  });
};

module.exports = {
  "/json": {
    method: "get",
    // json对象
    result: {
      success: true,
      data: { message: "json" },
    },
  },

  "/pureFunction": {
    method: "get",
    // pure function
    result(req, res, next) {
      return {
        success: true,
        data: { message: "pureFunction" },
      };
    },
  },

  "/async": {
    method: "get",
    // 异步
    async result(req, res, next) {
      await sleep(2000);

      return {
        success: true,
        data: { message: "async" },
      };
    },
  },
};
