import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { RedisService } from '../redis/redis.service';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todosRepository: Repository<Todo>,
    private redisService: RedisService,
    private rabbitMQService: RabbitMQService,
    private auditService: AuditService,
  ) {}

  async findAll(): Promise<Todo[]> {
    return this.todosRepository.find();
  }

  async findOne(id: string): Promise<Todo> {
    const todo = await this.todosRepository.findOne({
      where: { id },
    });
    
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    
    return todo;
  }

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const todo = this.todosRepository.create(createTodoDto);
    const savedTodo = await this.todosRepository.save(todo);
    
    // Log to audit
    await this.auditService.logTodoCreation(savedTodo);
    
    // Send message to RabbitMQ
    await this.rabbitMQService.sendMessage('todo.created', savedTodo);
    
    return savedTodo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.findOne(id);
    Object.assign(todo, updateTodoDto);
    return this.todosRepository.save(todo);
  }

  async remove(id: string): Promise<void> {
    const todo = await this.findOne(id);
    await this.todosRepository.remove(todo);
    
    // Log to audit
    await this.auditService.logTodoDeletion({ id });
    
    // Send message to RabbitMQ
    await this.rabbitMQService.sendMessage('todo.deleted', { id });
  }
} 