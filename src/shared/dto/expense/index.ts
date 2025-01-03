import { ExpenseCategory } from '@prisma/client';
import {
  IsDate,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class ExpenseDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  category: ExpenseCategory;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  //   @IsNotEmpty()
  //   @IsString()
  //   @IsISO8601()
  //   date: string;
}
