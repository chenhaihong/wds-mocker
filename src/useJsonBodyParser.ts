import bodyParser from "body-parser";

import { Application } from "express";

export default function useJsonBodyParser(app: Application): void {
  app.use(bodyParser.json());
}
