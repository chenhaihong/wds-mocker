import { Application, Request, Response, NextFunction } from "express";

export type CreateMockOptions =
  | undefined
  | {
      onUrlencoded: boolean;
      onJSONBodyParser: boolean;
      mockDir: string;
    };

export type MockItem = {
  method: string;
  result: function | object;
};

export type MockMap = {
  [propName: string]: MockItem;
};

export type MockFunction = {
  (app: Application): void;
};

export type CreateMockFunction = {
  (options: CreateMockOptions): MockFunction;
};
