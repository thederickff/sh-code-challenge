import { User } from "../entities/user.entity";

export interface UserRepository {

  findById(id: number): Promise<User | null>;

  create(user: User): Promise<void>;

  deleteById(id: number): Promise<void>;

}