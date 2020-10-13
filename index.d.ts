import type { Application, Request, Response, NextFunction } from "express";

// 模块声明
declare namespace WdsMocker {
  export function createAttachMocker(
    dir: Required<string>,
    options?: MockerOptions
  ): AttachMocker;

  export function createAttachUploader(
    dir: Required<string>,
    options?: UploaderOptions
  ): AttachUploader;

  type MockerOptions = {
    onUrlencodedParser?: boolean;
    onJsonBodyParser?: boolean;
    onLogger?: boolean;
    onWatcher?: boolean;
    onRouteParametersCapturer?: boolean;
  };
  type AttachMocker = {
    (app: Application): void;
  };

  type AttachUploader = {
    (app: Application): void;
  };
  type UploaderOptions = {
    onWatcher?: boolean;
    onLogger?: boolean;
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
    emit(event: "updateMocker" | "updateUploader"): void;
    on(event: "updateMocker" | "updateUploader", handler: Function): this;
  }
}
export = WdsMocker;
