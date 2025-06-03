import {
  Get,
  Param,
  Controller,
  Post,
  Body,
  Patch,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @Get('/')
  getAllUser() {
    return this.userService.findAll();
  }

  @Get('/:id')
  getUser(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  // @Post()
  // createUser(
  //   @Body() body: { username: string; email: string; password: string },
  // ) {
  //   return this.userService.create(body);
  // }

  @Post()
  @UsePipes(new ValidationPipe({whitelist: true}))
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch('/users/:username')
  updateUser(@Param('username') username: number,
    @Body() body: { username: string; email: string; password: string },
  ) {
    return this.userService.update(username, body);
  }

  @Delete('/users/:username')
  deleteUser(@Param('username') username: number) {
    return this.userService.remove(username);
  }
}
