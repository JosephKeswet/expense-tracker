import { Body, Controller, Delete, Post, Put, Query } from '@nestjs/common';
import { IResponse } from 'src/shared/types/response';
import { ExpenseService } from './expense.service';
import { ExpenseDto } from 'src/shared/dto/expense';

@Controller('expense')
export class ExpenseController {
  constructor(private expenseService: ExpenseService) {}
  @Post('create')
  async createExpense(@Body() expenseDto: ExpenseDto): Promise<IResponse> {
    return await this.expenseService.createExpense(expenseDto);
  }

  @Post('get')
  async getExpenses(): Promise<IResponse> {
    return await this.expenseService.getExpenses();
  }

  @Put('update')
  async updateExpense(
    @Query('id') id: string,
    @Body() expenseDto: ExpenseDto,
  ): Promise<IResponse> {
    return await this.expenseService.updateExpense(id, expenseDto);
  }

  @Delete('delete')
  async removeExpense(@Query('id') id: string): Promise<IResponse> {
    return await this.expenseService.removeExpense(id);
  }
}
