import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from 'src/tasks/task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { NotificationService } from 'src/notification/notification.service';


@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepo: Repository<Task>,
    private readonly notifier: NotificationService
  ) { }

  async createTask(body: CreateTaskDto) {
    const newTask = this.tasksRepo.create({
      ...body,
      createdAt: new Date().toISOString(),
      completedAt: null,

    });
    this.notifier.notify(`Task "${body.name}" created.`)

    return this.tasksRepo.save(newTask);
  }

  async getTask(id: number) {
    const task = await this.tasksRepo.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async findOne(id: number) {
    const task = await this.tasksRepo.findOne({ where: { id }, relations: ['user'] });
    if (!task) {
      throw new NotFoundException('Task with id ${id} not found')
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
    const saved = await this.tasksRepo.save(task);
    // Return full updated task with relations (e.g. user)
    return this.tasksRepo.findOne({ where: { id: saved.id }, relations: ['user'] });
  }

  async deleteTask(id: number) {
    const result = await this.tasksRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return { message: 'success' }
  }

  async softDeleteAllTasks() {
    const tasks = await this.tasksRepo.find();
    await this.tasksRepo.softRemove(tasks);
    return { message: `All tasks delete successfully` };
  }
}
