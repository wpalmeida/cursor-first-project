import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
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

  async findAll(userId: string): Promise<Todo[]> {
    return this.todosRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async findOne(userId: string, id: string): Promise<Todo> {
    const todo = await this.todosRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['user'],
    });
    
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    
    return todo;
  }

  async create(userId: string, createTodoDto: CreateTodoDto): Promise<Todo> {
    const todo = this.todosRepository.create({
      ...createTodoDto,
      user: { id: userId },
    });
    const savedTodo = await this.todosRepository.save(todo);
    
    // Log to audit
    await this.auditService.logTodoCreation(savedTodo);
    
    // Send message to RabbitMQ
    await this.rabbitMQService.sendMessage('todo.created', savedTodo);
    
    return savedTodo;
  }

  async update(userId: string, id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.findOne(userId, id);
    Object.assign(todo, updateTodoDto);
    return this.todosRepository.save(todo);
  }

  async remove(userId: string, id: string): Promise<void> {
    const todo = await this.findOne(userId, id);
    await this.todosRepository.remove(todo);
    
    // Log to audit
    await this.auditService.logTodoDeletion({ id });
    
    // Send message to RabbitMQ
    await this.rabbitMQService.sendMessage('todo.deleted', { id });
  }
} 