import { Application, Request, Response, NextFunction, request } from "express";
import { type } from "os";

declare namespace WdsMocker {
  export function createAttachMocker(options?: MockerOptions): AttachMocker;

  type AttachMocker = {
    (app: Application): void;
  };
  type MockerOptions = {
    mockDir: string;
    onUrlencodedParser: boolean;
    onJsonBodyParser: boolean;
  };
  interface MockMap<K, V> extends Map {
    [requestPath: string]: ResultMap;
  }
  interface ResultMap<K, V> extends Map {
    [requestMethod: string]: MockResult;
  }
  type MockResult =
    | {
        (param: {
          method: string; // 请求方法
          path: string; // 请求路径
          params: object; // 动态路由的动态参数集
          query: object; // 查询参数集
          body: object; // body参数集
        }): object;
      }
    | object;
}
export = WdsMocker;
