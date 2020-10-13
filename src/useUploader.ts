import type { Application, Request, Response, NextFunction } from "express";

import path from "path";
import chalk from "chalk";
import fse from "fs-extra";
import multiparty from "multiparty";

import eventBus from "./eventBus";

let cachedMockMap: any = null;

export default function useUploader(
  app: Application,
  mockDir: string,
  options: any
) {
  const { onWatcher, onLogger } = options;
  // 0 订阅，监听文件改变
  if (onWatcher) {
    eventBus.on("updateMocker", () => {
      cachedMockMap = null;
    });
  }
  app.use(function (req: Request, res: Response, next: NextFunction) {
    try {
      // 1 获取mockMap
      const mockMap = getMockMap(mockDir);

      // 2 没mock这个url，则next
      let hasMatch = false;
      if (mockMap.has(req.path)) {
        hasMatch = true;
      }
      if (!hasMatch) return next();

      // 3 拿到当前 url 对应的 optionsResultMap
      //   如果没有这个指定的请求类型，且没用通用类型，则next
      const optionsResultMap = mockMap.get(req.path);
      const upCasedMethod = req.method.toUpperCase();
      let optionsResult: any;
      if (optionsResultMap.has(upCasedMethod)) {
        optionsResult = optionsResultMap.get(upCasedMethod);
      } else if (optionsResultMap.has("*")) {
        optionsResult = optionsResultMap.get("*");
      } else {
        return next();
      }

      // 4 终端打印提示
      if (onLogger) {
        const _mockFlag = chalk.white.bgMagentaBright(" WDS-MOCKER ");
        const _method = chalk.white.bgMagentaBright(` ${upCasedMethod} `);
        const _url = chalk.magentaBright(req.url);
        console.log(`${_mockFlag} ${_method} ${_url}`);
      }

      // 5 执行
      const form = new multiparty.Form(optionsResult.options || {});
      form.parse(req, async function (err, fields, files) {
        typeof optionsResult.result === "function"
          ? res.json(await optionsResult.result(err, fields, files))
          : res.json(optionsResult.result);
      });
    } catch (error) {
      next(error);
    }
  });
}

function getMockMap(dir: string) {
  if (cachedMockMap) return cachedMockMap;

  // （1）mock目录下所有的js文件，把他们全部合并到mockMap对象
  const mockMap: any = new Map();

  // （2）确认mock目录
  fse.ensureDirSync(dir);

  // （3）构建mocksMap
  const files = fse.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fse.statSync(filePath).isFile() && /\.js$/.test(file)) {
      const list = require(filePath);
      for (const [
        methodUrl, // 比如: ' POST  /profile '
        optionsResult,
      ] of Object.entries(list)) {
        const arr = methodUrl.trim().split(" ");
        const [
          method, // POST
          url, // /profile
        ] = [arr[0], arr[arr.length - 1]];

        let _map;
        if (mockMap.has(url)) {
          _map = mockMap.get(url);
        } else {
          _map = new Map();
          mockMap.set(url, _map);
        }
        _map.set(method.toUpperCase(), optionsResult);
      }
    }
  }

  cachedMockMap = mockMap;
  return mockMap;
}
