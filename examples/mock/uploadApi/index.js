module.exports = {
  // 文件上产模拟接口
  "POST /profile": {
    fields: [
      { name: "avatar", maxCount: 1 },
      { name: "gallery", maxCount: 8 },
    ],
    result: () => {
      return {
        success: true,
        message: "文件上传成功",
        data: {
          avatar: "/uploads/avatar.png",
          gallery: ["/uploads/gallery-1.png", "/uploads/gallery-2.png"],
        },
      };
    },
  },
};
