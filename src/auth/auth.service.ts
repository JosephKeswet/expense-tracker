import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from 'src/shared/dto/auth';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { IResponse } from 'src/shared/types/response';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private data: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signIn({ email, password }: SignInDto): Promise<IResponse> {
    const user = await this.data.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        message: 'User not found',
        status: 404,
      };
    }

    const correctPassword: boolean = await argon2.verify(
      user.passwordHash,
      password,
    );

    if (!correctPassword) {
      return {
        message: `You entered an incorrect login Password, please try again or click on 'Forgot Password'`,
        status: 400,
        state: 'error',
      };
    }

    const { passwordHash, ...result } = user;

    const jwtPayload = {
      id: user.id,
      email: user.email,
    };

    const token = await this.jwtService.sign(jwtPayload);

    return {
      data: result,
      message: 'Logged in successfully',
      status: 200,
      token,
    };
  }
}
