import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto, VerifyEmailDto } from 'src/shared/dto/auth';
import { AuthGuard } from 'src/shared/guards/auth';
import { Public } from 'src/shared/decorators/auth';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signin')
  async signIn(@Body() signInDto: SignInDto) {
    // Implement sign in logic here
    return this.authService.signIn(signInDto);
  }

  @Public()
  @Post('/signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    // Implement sign up logic here
    return this.authService.signUp(signUpDto);
  }

  @Public()
  @Post('/verify-email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return await this.authService.verifyEmail(verifyEmailDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
