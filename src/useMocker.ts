import type { Application, Request, Response, NextFunction } from "express";
import type { MockMap, ResultMap, MockResult } from "../index";

import path from "path";
import chalk from "chalk";
import fse from "fs-extra";
const pathToRegexp = require("path-to-regexp");

import eventBus from "./eventBus";

let isUpdated: boolean = true; // mock文件夹的内容是否更新了
let cachedMockMap: MockMap<string, ResultMap<string, MockResult>> | null = null;

export default function useMocker(
  app: Application,
  mockDir: string,
  options: {
    onWatcher: boolean;
    onLogger: boolean;
    onRouteParametersCapturer: boolean;
  }
): void {
  const { onWatcher, onLogger, onRouteParametersCapturer } = options;
  // 0 订阅，监听文件改变
  if (onWatcher) {
    eventBus.on("updateMocker", () => {
      isUpdated = true;
    });
  }
  app.use(async function (req: Request, res: Response, next: NextFunction) {
    try {
      // 1 获取mockMap
      const mockMap = getMockMap(mockDir);

      // 2 没mock这个url，且动态路由中也没有匹配项，则next
      let hasMatch = false;
      let matchedResult: any = {};
      let [dynamicPath, params] = ["", {}];
      if (mockMap.has(req.path)) {
        hasMatch = true;
      }
      if (onRouteParametersCapturer && !hasMatch) {
        if ((matchedResult = matchDynamicPath(req.path, mockMap))) {
          hasMatch = true;
          params = matchedResult.params;
          dynamicPath = matchedResult.path;
        }
      }
      if (!hasMatch) return next();

      // 3 拿到当前 url 对应的 resultMap
      //   如果没有这个指定的请求类型，且没用通用类型，则next
      const resultMap = mockMap.get(dynamicPath || req.path);
      const upCasedMethod = req.method.toUpperCase();
      let result: MockResult;
      if (resultMap.has(upCasedMethod)) {
        result = resultMap.get(upCasedMethod);
      } else if (resultMap.has("*")) {
        result = resultMap.get("*");
      } else {
        return next();
      }

      // 4 终端打印提示
      if (onLogger) {
        const _method = chalk.white.bgMagentaBright(` ${upCasedMethod} `);
        const _mockFlag = chalk.white.bgMagentaBright(" WDS-MOCKER ");
        const _url = chalk.magentaBright(req.url);
        console.log(`${_method} ${_mockFlag} ${_url}`);
      }

      // 5 执行
      req.params = { ...req.params, ...params };
      typeof result === "function"
        ? res.json(await result(req, res))
        : res.json(result);
    } catch (error) {
      next(error);
    }
  });
}

function getMockMap(dir: string) {
  if (isUpdated) {
    cachedMockMap = null;
    isUpdated = false;
  }
  if (cachedMockMap) return cachedMockMap;

  // （1）mock目录下所有的js文件，把他们全部合并到mocks对象
  const mockMap: MockMap<string, ResultMap<string, MockResult>> = new Map();

  // （2）确认mock目录
  fse.ensureDirSync(dir);

  // （3）构建mocksMap
  const files = fse.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fse.statSync(filePath).isFile() && /\.js$/.test(file)) {
      // delete require.cache[require.resolve(filePath)];
      const list = require(filePath);
      for (const [
        methodUrl, // 比如: ' get  /auth/login '
        result,
      ] of Object.entries(list)) {
        const arr = methodUrl.trim().split(" ");
        const [
          method, // GET
          url, // /auth/login
        ] = [arr[0], arr[arr.length - 1]];

        let resultMap;
        if (mockMap.has(url)) {
          resultMap = mockMap.get(url);
        } else {
          resultMap = new Map();
          mockMap.set(url, resultMap);
        }
        resultMap.set(method.toUpperCase(), result);
      }
    }
  }

  cachedMockMap = mockMap;
  return mockMap;
}

function matchDynamicPath(reqPath: string, MockMap: any) {
  for (let path of MockMap.keys()) {
    const match = pathToRegexp.match(path, { decode: decodeURIComponent });
    const result = match(reqPath);
    if (result) {
      return { path, params: result.params };
    }
  }
  return false;
}
