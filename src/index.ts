import path from "path";
import { Application } from "express";

import useUrlencodedParser from "./useUrlencodedParser";
import useJsonBodyParser from "./useJsonBodyParser";
import useWatcher from "./useWatcher";
import useMocker from "./useMocker";

import { MockerOptions, AttachMocker } from "../index";

function createAttachMocker(options?: MockerOptions): AttachMocker {
  const {
    mockDir = path.resolve(process.cwd(), "./mock"),
    onUrlencodedParser = true,
    onJsonBodyParser = true,
    onLogger = true,
    onWatcher = true,
  } = options || {};

  return function attachMocker(app: Application): void {
    onUrlencodedParser && useUrlencodedParser(app);
    onJsonBodyParser && useJsonBodyParser(app);
    onWatcher && useWatcher(mockDir, { onLogger });
    useMocker(app, mockDir, { onWatcher, onLogger });
  };
}
export { createAttachMocker };
