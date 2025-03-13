import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Audit, AuditDocument } from './audit.schema';

@Injectable()
export class AuditService {
  constructor(
    @InjectModel(Audit.name)
    private auditModel: Model<AuditDocument>,
  ) {}

  async logTodoCreation(todo: any) {
    await this.createAuditLog('CREATE', 'todo', todo.id, todo);
  }

  async logTodoUpdate(todo: any) {
    await this.createAuditLog('UPDATE', 'todo', todo.id, todo);
  }

  async logTodoDeletion(todo: { id: string }) {
    await this.createAuditLog('DELETE', 'todo', todo.id, todo);
  }

  private async createAuditLog(
    action: string,
    entityType: string,
    entityId: string,
    data: any,
  ) {
    const audit = new this.auditModel({
      action,
      entityType,
      entityId,
      data,
    });

    await audit.save();
  }
} 