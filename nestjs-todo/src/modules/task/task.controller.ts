import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get('/')
  getAllTask() {
    return this.taskService.findAll();
  }

  @Get('/:id')
  getTask(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.getTask(id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.createTask(createTaskDto);
  }

  @Patch('/:id/done')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async markTaskAsDone(
    @Body() updateTaskDto: UpdateTaskDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const updated = await this.taskService.updateTask(id, updateTaskDto);
    console.log('Updated (done) task:', updated);
    return updated;
  }

  @Patch('/:id/pending')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async markTaskAsPending(
    @Body() updateTaskDto: UpdateTaskDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const updated = await this.taskService.updateTask(id, updateTaskDto);
    console.log('Updated (pending) task:', updated);
    return updated;
  }

  @Delete('/:id')
  deleteTask(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.deleteTask(id);
  }

  @Delete('/')
  softDeleteAll() {
    return this.taskService.softDeleteAllTasks();
  }
}
