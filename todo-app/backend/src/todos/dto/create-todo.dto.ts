import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  readonly title: string;

  @IsBoolean()
  @IsOptional()
  readonly completed?: boolean = false;

  @IsString()
  @IsOptional()
  readonly userId?: string;
} 