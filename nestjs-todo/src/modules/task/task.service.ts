import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from 'src/tasks/task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';


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
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async findOne(id: number) {
    const task = this.tasksRepo.findOne({ where: { id }, relations: ['user'] });
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`)
    }

    return task;

  }

  findAll() {
    return this.tasksRepo.find({ relations: ['user'] })
  }

  async updateTask(id: number, updateTaskDto: UpdateTaskDto) {
    if (updateTaskDto.completedAt !== undefined && updateTaskDto.completedAt !== null) {
      updateTaskDto.completedAt = new Date(updateTaskDto.completedAt);
    }

    await this.tasksRepo.update(id, updateTaskDto);

    const updated = await this.tasksRepo.findOne({ where: { id }, relations: ['user'] });
    if (!updated) {
      throw new NotFoundException(`Task with id ${id} not found after update`);
    }

    return updated;
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
