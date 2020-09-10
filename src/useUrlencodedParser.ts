import bodyParser from "body-parser";

import { Application } from "express";

export default function useUrlencodedParser(app: Application): void {
  app.use(bodyParser.urlencoded({ extended: true }));
}
