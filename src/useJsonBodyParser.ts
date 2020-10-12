import type { Application } from "express";

import bodyParser from "body-parser";

export default function useJsonBodyParser(app: Application): void {
  app.use(bodyParser.json());
}
