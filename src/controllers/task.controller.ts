import { Request, Response } from 'express';
import { DeleteTaskUseCase } from '../use-cases/task/delete-task.usecase';
import { FindAllByUserTaskUseCase } from '../use-cases/task/find-all-task-by-user.usecase';
import { FindAllTaskUseCase } from '../use-cases/task/find-all-task.usecase';
import { SaveTaskUseCase } from '../use-cases/task/save-task.usecase';

export class TaskController {

  constructor(
    private findAllUseCase: FindAllTaskUseCase,
    private findAllByUserUseCase: FindAllByUserTaskUseCase,
    private saveTaskUseCase: SaveTaskUseCase,
    private deleteUseCase: DeleteTaskUseCase
  ) { }

  async findAll(req: Request, res: Response) {
    try {
      const authUserId = req.user?.id!;

      const tasks = await this.findAllUseCase.execute(authUserId);

      res.status(200).json({ data: tasks });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async findAllByUserId(req: Request, res: Response) {
    try {
      const authUserId = req.user?.id!;
      const { userId } = req.params;

      const tasks = await this.findAllByUserUseCase.execute(authUserId, { userId: +userId });

      res.status(200).json({ data: tasks });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async save(req: Request, res: Response) {
    try {
      const { summary, id } = req.body;
      const authUserId = req.user?.id!;

      const task = await this.saveTaskUseCase.execute(authUserId, {
        summary, userId: authUserId, id
      });

      res.status(200).json({ data: task });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const authUserId = req.user?.id!;

      await this.deleteUseCase.execute(authUserId, { id: +id });

      res.status(200).json({ data: 'success' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}