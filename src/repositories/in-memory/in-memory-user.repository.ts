import { User } from "../../entities/user.entity";
import { UserRepository } from "../user.repository";

export class InMemoryUserRepository implements UserRepository {

  private items: User[] = [];


  async findById(id: number): Promise<User | null> {
    const index = this.items.findIndex(item => item.id === id);

    if (index < 0) {
      return null;
    }

    return this.items[index];
  }

  async create(user: User): Promise<void> {
    this.items.push(user);
    user.id = this.items.length;
  }

  async update(user: User): Promise<void> {
    const index = this.items.findIndex(item => item.id === user.id);

    if (index > -1) {
      this.items[index] = user;
    }
  }

  async deleteById(id: number): Promise<void> {
    this.items = this.items.filter(item => item.id !== id);
  }
}