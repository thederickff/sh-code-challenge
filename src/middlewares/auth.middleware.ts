import { Request, Response, NextFunction } from "express";
import { FindUserUseCase } from "../use-cases/user/find-user.usecase";
import { BaseMiddleware } from "./base.middleware";

export class AuthMiddleware extends BaseMiddleware {

  constructor(
    private findUserUseCase: FindUserUseCase
  ) {
    super();
  }

  async handle(
    req: Partial<Request>,
    res: Partial<Response>,
    next: NextFunction
  ): Promise<void> {
    try {
      if (
        req &&
        req.headers &&
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer ')
      ) {
        const token = req.headers.authorization.split(' ')[1];
        // req.user = await this.decodeTokenUseCase.execute(token);
        req.user = await this.findUserUseCase.execute({ id: +token });

        next();
      } else {
        res.status?.(401).send({ message: 'InvalidToken'});
      }
    } catch (error: any) {
      res.status?.(401).send({ message: error.message });
    }
  }
}