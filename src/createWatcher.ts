const chokidar = require("chokidar");
const clearModule = require("clear-module");
import chalk from "chalk";

import eventBus from "./eventBus";

const types = ["change", "unlink", "add", "unlinkDir", "addDir"];
export default function createWatcher(
  watcherType: "updateMocker" | "updateUploader"
) {
  const eventName = watcherType;

  return function watcher(
    dir: Required<string>,
    options: { onLogger: boolean }
  ): void {
    const { onLogger } = options;
    chokidar.watch(dir).on("all", (event: string, path: string) => {
      if (onLogger && types.includes(event)) {
        const _mockFlag = chalk.white.bgMagentaBright(" WDS-MOCKER ");
        const _watcher = chalk.white.bgMagentaBright(
          ` Watcher:${watcherType} `
        );
        const _event = chalk.white.bgMagentaBright(` ${event} `);
        const _url = chalk.magentaBright(path).replace(process.cwd(), "");
        console.log(`${_mockFlag} ${_watcher} ${_event} ${_url}`);
      }

      switch (event) {
        // 文件
        case "change":
        case "unlink":
          clearModule(path);
        case "add":
          eventBus.emit(eventName);
          break;
        // 文件夹
        case "unlinkDir":
          const regex = new RegExp(`^${path}`, "");
          clearModule.match(regex);
        case "addDir":
          eventBus.emit(eventName);
          break;
      }
    });
  };
}
