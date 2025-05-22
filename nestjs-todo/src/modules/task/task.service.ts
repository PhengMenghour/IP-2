import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from 'src/tasks/task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';


@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepo: Repository<Task>,
  ) { }

  async createTask(body: CreateTaskDto) {
    const newTask = this.tasksRepo.create({
      ...body,
      createdAt: new Date().toISOString(),
      completedAt: null,
    });

    return this.tasksRepo.save(newTask);
  }

  async getTask(id: number) {
    const task = await this.tasksRepo.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException("Task with ID ${id} not found");
    }

    return task;
  }

  findAll() {
    return this.tasksRepo.find({ relations: ['user'] })
  }

  async updateTask(id: number, updateData: Partial<Task>) {
    const task = await this.tasksRepo.preload({ id, ...updateData });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return this.tasksRepo.save(task);
  }

  async deleteTask(id: number) {
    const result = await this.tasksRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException("Task with ID ${id} not found");
    }
    return { message: 'success' }
  }

  async softDeleteAllTasks() {
    const tasks = await this.tasksRepo.find();
    await this.tasksRepo.softRemove(tasks);
    return { message: "All tasks delete successfully" };
  }
}
