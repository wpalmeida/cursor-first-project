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
  private readonly CACHE_KEY = 'todos';

  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
    private redisService: RedisService,
    private rabbitMQService: RabbitMQService,
    private auditService: AuditService,
  ) {}

  async findAll(): Promise<Todo[]> {
    // Try to get from cache first
    const cachedTodos = await this.redisService.get<Todo[]>(this.CACHE_KEY);
    if (cachedTodos) {
      return cachedTodos;
    }

    // If not in cache, get from database
    const todos = await this.todoRepository.find();
    
    // Store in cache
    await this.redisService.set(this.CACHE_KEY, todos);
    
    return todos;
  }

  async findOne(id: string): Promise<Todo> {
    const todo = await this.todoRepository.findOneBy({ id });
    
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    
    return todo;
  }

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    // Create new todo
    const todo = this.todoRepository.create(createTodoDto);
    const savedTodo = await this.todoRepository.save(todo);
    
    // Invalidate cache
    await this.redisService.del(this.CACHE_KEY);
    
    // Log to audit
    await this.auditService.logTodoCreation(savedTodo);
    
    // Send message to RabbitMQ
    await this.rabbitMQService.sendMessage('todo.created', savedTodo);
    
    return savedTodo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.findOne(id);
    
    // Update the todo
    const updatedTodo = { ...todo, ...updateTodoDto };
    await this.todoRepository.save(updatedTodo);
    
    // Invalidate cache
    await this.redisService.del(this.CACHE_KEY);
    
    // Log to audit
    await this.auditService.logTodoUpdate(updatedTodo);
    
    // Send message to RabbitMQ
    await this.rabbitMQService.sendMessage('todo.updated', updatedTodo);
    
    return updatedTodo;
  }

  async remove(id: string): Promise<void> {
    const todo = await this.findOne(id);
    
    await this.todoRepository.remove(todo);
    
    // Invalidate cache
    await this.redisService.del(this.CACHE_KEY);
    
    // Log to audit
    await this.auditService.logTodoDeletion({ id });
    
    // Send message to RabbitMQ
    await this.rabbitMQService.sendMessage('todo.deleted', { id });
  }
} 