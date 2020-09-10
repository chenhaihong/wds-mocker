import path from "path";
import { Application } from "express";

import useUrlencodedParser from "./useUrlencodedParser";
import useJsonBodyParser from "./useJsonBodyParser";
import useMock from "./useMock";

import { MockerOptions, AttachMocker } from "../index";

function createAttachMocker(options?: MockerOptions): AttachMocker {
  const {
    mockDir = path.resolve(process.cwd(), "./mock"),
    onUrlencodedParser = true,
    onJsonBodyParser = true,
  } = options || {};

  return function attachMocker(app: Application): void {
    onUrlencodedParser && useUrlencodedParser(app);
    onJsonBodyParser && useJsonBodyParser(app);
    useMock(app, mockDir);
  };
}
export { createAttachMocker };
