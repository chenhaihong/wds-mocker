const path = require("path");

module.exports = {
  // 文件上产模拟接口
  "POST /profile": {
    options: {
      uploadDir: path.resolve(__dirname, "../../public/uploads"),
      maxFilesSize: 1024 * 1024 * 2, // 1024 bytes * 1024 * 2 => 2 Mb
    },
    result: (err, fields, files) => {
      if (err) {
        return {
          success: false,
          message: err.message,
          data: {},
        };
      }
      return {
        success: true,
        message: "文件上传成功",
        data: {
          fields,
          files,
        },
      };
    },
  },
};
