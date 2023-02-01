import express from "express";
import { User } from "../../entities/user.entity";

declare global {
  namespace Express {
    interface Request {
      user?: User | null
    }
  }
}