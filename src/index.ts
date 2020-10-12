import type { Application } from "express";
import type {
  MockerOptions,
  AttachMocker,
  UploaderOptions,
  AttachUploader,
} from "../index";

import { resolve } from "path";

import useUrlencodedParser from "./useUrlencodedParser";
import useJsonBodyParser from "./useJsonBodyParser";
import useMokcerWatcher from "./useMokcerWatcher";
import useMocker from "./useMocker";
import useUploaderWatcher from "./useUploaderWatcher";
import useUploader from "./useUploader";

function createAttachMocker(
  dir: Required<string>,
  options?: MockerOptions
): AttachMocker {
  if (!dir) {
    dir = resolve(process.cwd(), "mock/api");
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

    onWatcher && useMokcerWatcher(dir, { onLogger });
    useMocker(app, dir, { onWatcher, onLogger, onRouteParametersCapturer });
  };
}

function createAttachUploader(
  dir: Required<string>,
  options?: UploaderOptions
): AttachUploader {
  if (!dir) {
    dir = resolve(process.cwd(), "mock/uploadApi");
  }
  const { onLogger = true, onWatcher = true } = options || {};

  return function (app: Application) {
    onWatcher && useUploaderWatcher(dir, { onLogger });
    useUploader(app, dir, { onWatcher, onLogger });
  };
}

export { createAttachMocker, createAttachUploader };
