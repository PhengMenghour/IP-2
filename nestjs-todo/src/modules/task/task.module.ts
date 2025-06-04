import { Module } from '@nestjs/common';
import { TasksController } from './task.controller';
import { TasksService } from './task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/tasks/task.entity';
import { UserModule } from '../user/user.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), UserModule, NotificationModule.register({ type: 'log' })],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TaskModule { }
