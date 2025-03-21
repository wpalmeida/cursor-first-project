import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { TodosModule } from './todos/todos.module';
import { AuditModule } from './audit/audit.module';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { RedisModule } from './redis/redis.module';
<<<<<<< HEAD
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
=======
>>>>>>> 47f2224 (Updated MongoDB URI in .env file, refactored TypeORM and Mongoose configurations in app.module.ts for improved clarity, and modified TodosService to temporarily disable Redis caching while renaming the todo repository variable for consistency.)

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // TypeORM configuration for PostgreSQL
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    
    // MongoDB configuration
    MongooseModule.forRoot(process.env.MONGODB_URI),
    
    // Import feature modules
    TodosModule,
    AuditModule,
    RabbitMQModule,
<<<<<<< HEAD
    RedisModule,
    AuthModule,
    UsersModule,
=======
    // Temporarily disable Redis module
    // RedisModule,
>>>>>>> 47f2224 (Updated MongoDB URI in .env file, refactored TypeORM and Mongoose configurations in app.module.ts for improved clarity, and modified TodosService to temporarily disable Redis caching while renaming the todo repository variable for consistency.)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {} 