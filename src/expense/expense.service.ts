import { Injectable } from '@nestjs/common';
import { ExpenseDto } from 'src/shared/dto/expense';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { IResponse } from 'src/shared/types/response';

@Injectable()
export class ExpenseService {
  constructor(private data: PrismaService) {}

  async createExpense(expenseDto: ExpenseDto): Promise<IResponse> {
    const sameDescription = await this.data.expenses.findUnique({
      where: {
        description: expenseDto.description,
      },
    });

    if (sameDescription) {
      return {
        message: 'Expense with this description already exists',
        status: 409,
        state: 'error',
      };
    }

    try {
      const expense = await this.data.expenses.create({
        data: expenseDto,
      });
      return {
        message: 'Expense created successfully',
        status: 201,
        state: 'success',
        data: expense,
      };
    } catch (error) {
      console.error('Error creating expense:', error);
      throw error;
    }
  }

  async getExpenses(): Promise<IResponse> {
    try {
      const expenses = await this.data.expenses.findMany();
      if (expenses.length === 0) {
        return {
          message: 'No expenses created yet',
          status: 200,
          state: 'success',
          data: expenses,
        };
      }
      return {
        message: 'Expenses retrieved successfully',
        status: 200,
        state: 'success',
        data: expenses,
      };
    } catch (error) {
      console.error('Error retrieving expenses:', error);
      throw error;
    }
  }

  async removeExpense(id: string): Promise<IResponse> {
    try {
      const expense = await this.data.expenses.delete({
        where: {
          id,
        },
      });

      return {
        message: 'Expense deleted successfully',
        status: 200,
        state: 'success',
        data: expense,
      };
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  }

  async updateExpense(id: string, expenseDto: ExpenseDto): Promise<IResponse> {
    const expenseExists = await this.data.expenses.findUnique({
      where: {
        id,
      },
    });

    if (!expenseExists) {
      return {
        message: 'Expense not found',
        status: 404,
        state: 'error',
      };
    }
    try {
      const expense = await this.data.expenses.update({
        data: expenseDto,
        where: {
          id,
        },
      });

      return {
        message: 'Expense updated successfully',
        status: 200,
        state: 'success',
        data: expense,
      };
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  }
}
