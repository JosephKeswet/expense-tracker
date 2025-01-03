import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { UserService } from './user/user.service';
import { PrismaService } from './shared/prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { OtpService } from './otp/otp.service';
import { EmailService } from './email/email.service';
import { ExpenseService } from './expense/expense.service';
import { ExpenseController } from './expense/expense.controller';

@Module({
  imports: [AuthModule],
  controllers: [AppController, AuthController, ExpenseController],
  providers: [AppService, AuthService, UserService, PrismaService, OtpService, EmailService, ExpenseService],
})
export class AppModule {}
