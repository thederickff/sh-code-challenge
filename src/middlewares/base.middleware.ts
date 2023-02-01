import { Request, Response, NextFunction } from "express";

export abstract class BaseMiddleware {

  abstract handle(
    req: Partial<Request>,
    res: Partial<Response>,
    next: NextFunction
  ): Promise<void>;

}