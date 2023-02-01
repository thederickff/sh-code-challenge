import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import { TaskController } from './controllers/task.controller';
import { User } from './entities/user.entity';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { DeleteTaskUseCase } from './use-cases/task/delete-task.usecase';
import { FindAllByUserTaskUseCase } from './use-cases/task/find-all-task-by-user.usecase';
import { FindAllTaskUseCase } from './use-cases/task/find-all-task.usecase';
import { SaveTaskUseCase } from './use-cases/task/save-task.usecase';
import { FindUserUseCase } from './use-cases/user/find-user.usecase';
import { MySqlUserRepository } from './repositories/mysql/mysql-user.repository';
import { MySqlTaskRepository } from './repositories/mysql/mysql-task.repository';
import { initDB } from './config/database.config';

(async () => {
  dotenv.config()

  const PORT = process.env.SERVER_PORT || 3210;

  const app = express();

  const taskRepository = new MySqlTaskRepository();
  const userRepository = new MySqlUserRepository();

  await initDB();

  const manager = await userRepository.findById(1);

  if (!manager) {
    userRepository.create(new User({ name: 'Manager', type: 'manager' }));
    userRepository.create(new User({ name: 'Technician 01', type: 'technician' }));
    userRepository.create(new User({ name: 'Technician 02', type: 'technician' }));
  }

  const findUserUseCase = new FindUserUseCase(userRepository);
  const authMiddleware = new AuthMiddleware(findUserUseCase);

  const findAllTaskUseCase = new FindAllTaskUseCase(taskRepository, userRepository);
  const findAllByUserTaskUseCase = new FindAllByUserTaskUseCase(taskRepository, userRepository);
  const saveTaskUseCase = new SaveTaskUseCase(taskRepository, userRepository);
  const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository, userRepository);

  const taskController = new TaskController(
    findAllTaskUseCase,
    findAllByUserTaskUseCase,
    saveTaskUseCase,
    deleteTaskUseCase
  );

  app.use(express.json());
  app.use(cors({ origin: '*' }));

  app.use(authMiddleware.handle.bind(authMiddleware));

  app.get('/tasks', taskController.findAll.bind(taskController));
  app.get('/tasks/user/:userId', taskController.findAllByUserId.bind(taskController));
  app.post('/tasks', taskController.save.bind(taskController));
  app.delete('/tasks/:id', taskController.deleteById.bind(taskController));

  app.listen(PORT, () => {
    console.log(`Server listening to port ${PORT}`);
  });
})();