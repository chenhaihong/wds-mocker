import { Application, Request, Response, NextFunction, request } from "express";

// 模块声明
declare namespace WdsMocker {
  export function createAttachMocker(
    dir: Required<string>,
    options?: MockerOptions
  ): AttachMocker;

  type AttachMocker = {
    (app: Application): void;
  };
  type MockerOptions = {
    onUrlencodedParser?: boolean;
    onJsonBodyParser?: boolean;
    onLogger?: boolean;
    onWatcher?: boolean;
    onRouteParametersCapturer?: boolean;
  };
  interface MockMap<K, V> extends Map {
    [requestPath: string]: ResultMap;
  }
  interface ResultMap<K, V> extends Map {
    [requestMethod: string]: MockResult;
  }
  type MockResult =
    | {
        (req: Request | undefined, res: Response | undefined): object;
      }
    | object;

  interface EventBus extends NodeJS.EventEmitter {
    emit(event: "update"): void;
    on(event: "update", handler: Function): this;
  }
}
export = WdsMocker;
