import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  try {
    console.log('Starting NestJS application...');
    const app = await NestFactory.create(AppModule);
    
    // Enable CORS for frontend
    app.enableCors({
      origin: 'http://localhost:3000',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });
    
    // Enable validation pipes
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
    }));

    // Enable logging interceptor
    app.useGlobalInterceptors(new LoggingInterceptor());
    
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`\nApplication is running on: http://localhost:${port}`);
    console.log('Available routes:');
    console.log('- POST /auth/register');
    console.log('- POST /auth/login');
    console.log('- GET /todos');
    console.log('- POST /todos');
    console.log('- PATCH /todos/:id');
    console.log('- DELETE /todos/:id\n');
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap(); 