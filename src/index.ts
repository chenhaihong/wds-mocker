import path from "path";

import bodyParser from "body-parser";
import chalk from "chalk";
import fse from "fs-extra";

import { Application, Request, Response, NextFunction } from "express";
import {
  CreateMockFunction,
  CreateMockOptions,
  MockFunction,
  MockMap,
} from "../index";

const createMock: CreateMockFunction = function (
  options: CreateMockOptions
): MockFunction {
  const {
    onUrlencoded = true,
    onJSONBodyParser = true,
    mockDir = path.resolve(process.cwd(), "./mock"),
  } = options || {};

  return function (app: Application): void {
    onUrlencoded && useUrlencoded(app);
    onJSONBodyParser && useJSONBodyParser(app);
    useMock(app, mockDir);
  };
};
export { createMock };

function useUrlencoded(app: Application): void {
  app.use(bodyParser.urlencoded({ extended: true }));
}

function useJSONBodyParser(app: Application): void {
  app.use(bodyParser.json());
}

function useMock(app: Application, mockDir: string): void {
  app.use(async function (req: Request, res: Response, next: NextFunction) {
    // 1，取 mock map
    const mockMap = getMocks(mockDir);

    // 2，mocks集合中如果有匹配的路径，有则返回模拟结果，否则直接next结束
    const mockItem = mockMap[req.path];
    if (!mockItem) {
      return next();
    }

    // 3，方法不一致，next
    const { method, result } = mockItem;
    if (req.method.toLocaleLowerCase() !== method.toLocaleLowerCase()) {
      return next();
    }

    // 4，返回mock结果
    const _method = chalk.white.bgMagentaBright(` ${req.method} `);
    const _mockIndex = chalk.white.bgMagentaBright(" MOCK ");
    console.log(`${_method} ${_mockIndex} ${req.url}`);
    typeof result === "function"
      ? res.json(await result(req, res, next))
      : res.json(result);
  });
}

function getMocks(dir: string): MockMap {
  let map: MockMap = {};
  fse.ensureDirSync(dir);
  const files = fse.readdirSync(dir);
  for (const file of files) {
    const filePath = `${dir}/${file}`;
    if (/\.js$/.test(file) && fse.statSync(filePath).isFile()) {
      // 删除了缓存，修改接口文件时，不需要重启
      delete require.cache[require.resolve(filePath)];
      map = { ...map, ...require(filePath) };
    }
  }
  return map;
}
