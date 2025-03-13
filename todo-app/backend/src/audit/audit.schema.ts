import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuditDocument = Audit & Document;

@Schema({ timestamps: true })
export class Audit {
  @Prop({ required: true })
  action: string;

  @Prop({ required: true })
  entityType: string;

  @Prop({ required: true })
  entityId: string;

  @Prop({ type: Object })
  data: any;

  @Prop()
  userId?: string;
}

export const AuditSchema = SchemaFactory.createForClass(Audit); 