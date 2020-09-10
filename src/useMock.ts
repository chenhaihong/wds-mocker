import path from "path";
import chalk from "chalk";
import fse from "fs-extra";
const pathToRegexp = require("path-to-regexp");

import { Application, Request, Response, NextFunction } from "express";
import { MockMap, ResultMap, MockResult } from "../index";

export default function useMock(app: Application, mockDir: string): void {
  app.use(async function (req: Request, res: Response, next: NextFunction) {
    // 1 获取mockMap
    const mockMap = getMockMap(mockDir);

    // 2 没mock这个url，且动态路由中也没有匹配项，则next
    let hasMatch = false;
    let matchedResult: any = {};
    let [isDynamic, dynamicPath, params] = [false, "", {}];
    if (mockMap.has(req.path)) {
      hasMatch = true;
    }
    if (!hasMatch) {
      if ((matchedResult = matchDynamicPath(req.path, mockMap))) {
        hasMatch = isDynamic = true;
        params = matchedResult.params;
        dynamicPath = matchedResult.path;
      }
    }
    if (!hasMatch) return next();

    // 3 拿到当前 url 对应的 resultMap
    //   如果没有这个指定的请求类型，且没用通用类型，则next
    const resultMap = mockMap.get(isDynamic ? dynamicPath : req.path);
    const upCasedMethod = req.method.toUpperCase();
    let result = null;
    if (resultMap.has(upCasedMethod)) {
      result = resultMap.get(upCasedMethod);
    } else if (resultMap.has("*")) {
      result = resultMap.get("*");
    } else {
      return next();
    }

    // 4 终端打印提示
    const _method = chalk.white.bgMagentaBright(` ${upCasedMethod} `);
    const _mockFlag = chalk.white.bgMagentaBright(" MOCK ");
    const _url = chalk.magentaBright(req.url);
    console.log(`${_method} ${_mockFlag} ${_url}`);

    // 5 执行
    try {
      const { method, path, query, body } = req;
      typeof result === "function"
        ? res.json(await result({ method, path, params, query, body }))
        : res.json(result);
    } catch (error) {
      next(error);
    }
  });
}

function getMockMap(dir: string) {
  // （1）mock目录下所有的js文件，把他们全部合并到mocks对象
  const mockMap: MockMap<string, ResultMap<string, MockResult>> = new Map();

  // （2）确认mock目录
  fse.ensureDirSync(dir);

  // （3）构建mocksMap
  const files = fse.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fse.statSync(filePath).isFile() && /\.js$/.test(file)) {
      delete require.cache[require.resolve(filePath)];
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
