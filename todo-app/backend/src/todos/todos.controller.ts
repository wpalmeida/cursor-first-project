import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { TodosService } from './todos.service';
import { Todo } from './todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  findAll(@Request() req): Promise<Todo[]> {
    return this.todosService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string): Promise<Todo> {
    return this.todosService.findOne(req.user.userId, id);
  }

  @Post()
  create(@Request() req, @Body() createTodoDto: CreateTodoDto) {
    return this.todosService.create(req.user.userId, createTodoDto);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todosService.update(req.user.userId, id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.todosService.remove(req.user.userId, id);
  }
} 