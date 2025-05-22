import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { TasksService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';


@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) { }

  @Get('/')
  getAllTask() {
    return this.taskService.findAll()
  }

  @Get('/:id')
  getTask(@Param('id') id: number) {
    return this.taskService.getTask(id);
  }
  @Post()
  createTask(@Body() body: CreateTaskDto) {
    return this.taskService.createTask(body);
  }

  @Patch('/:id/done')
  markTaskAsDone(@Body() body: any, @Param('id', ParseIntPipe) id: number) {
    return this.taskService.updateTask(id, body);
  }

  @Patch('/:id/pending')
  markTaskAsPending(@Body() body: any, @Param('id', ParseIntPipe) id: number) {
    return this.taskService.updateTask(id, body);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: number) {
    return this.taskService.deleteTask(id);
  }

  @Delete('/')
  softDeleteAll() {
    return this.taskService.softDeleteAllTasks();
  }

}
