import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: any;
  private channel: any;
  private readonly queueName: string;

  constructor(private configService: ConfigService) {
    this.queueName = this.configService.get<string>('RABBITMQ_QUEUE', 'todo_queue');
  }

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect() {
    try {
      const host = this.configService.get<string>('RABBITMQ_HOST', 'localhost');
      const port = this.configService.get<number>('RABBITMQ_PORT', 5672);
      const user = this.configService.get<string>('RABBITMQ_USER', 'guest');
      const password = this.configService.get<string>('RABBITMQ_PASSWORD', 'guest');

      const url = `amqp://${user}:${password}@${host}:${port}`;
      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();
      
      // Ensure queue exists
      await this.channel.assertQueue(this.queueName, { durable: true });
      
      console.log('Connected to RabbitMQ');
    } catch (error) {
      console.error('Failed to connect to RabbitMQ', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      console.log('Disconnected from RabbitMQ');
    } catch (error) {
      console.error('Error disconnecting from RabbitMQ', error);
    }
  }

  async sendMessage(routingKey: string, message: any) {
    try {
      if (!this.channel) {
        await this.connect();
      }
      
      const messageBuffer = Buffer.from(JSON.stringify(message));
      return this.channel.publish('', this.queueName, messageBuffer, {
        persistent: true,
        headers: { routingKey },
      });
    } catch (error) {
      console.error('Error sending message to RabbitMQ', error);
      throw error;
    }
  }

  async consumeMessages(callback: (message: any, routingKey: string) => Promise<void>) {
    try {
      if (!this.channel) {
        await this.connect();
      }
      
      await this.channel.consume(this.queueName, async (msg) => {
        if (msg) {
          try {
            const content = JSON.parse(msg.content.toString());
            const routingKey = msg.properties.headers?.routingKey || 'unknown';
            
            await callback(content, routingKey);
            
            // Acknowledge the message
            this.channel.ack(msg);
          } catch (error) {
            console.error('Error processing message', error);
            // Reject the message and requeue
            this.channel.nack(msg, false, true);
          }
        }
      });
    } catch (error) {
      console.error('Error consuming messages from RabbitMQ', error);
      throw error;
    }
  }
} 