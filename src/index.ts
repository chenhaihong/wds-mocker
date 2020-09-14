import { resolve } from "path";
import { Application } from "express";

import useUrlencodedParser from "./useUrlencodedParser";
import useJsonBodyParser from "./useJsonBodyParser";
import useWatcher from "./useWatcher";
import useMocker from "./useMocker";

import { MockerOptions, AttachMocker } from "../index";

function createAttachMocker(
  dir: Required<string>,
  options?: MockerOptions
): AttachMocker {
  if (!dir) {
    dir = resolve(process.cwd(), "mock");
  }
  const {
    onUrlencodedParser = true,
    onJsonBodyParser = true,
    onLogger = true,
    onWatcher = true,
    onRouteParametersCapturer = false,
  } = options || {};

  return function attachMocker(app: Application): void {
    onUrlencodedParser && useUrlencodedParser(app);
    onJsonBodyParser && useJsonBodyParser(app);
    onWatcher && useWatcher(dir, { onLogger });
    useMocker(app, dir, { onWatcher, onLogger, onRouteParametersCapturer });
  };
}
export { createAttachMocker };
