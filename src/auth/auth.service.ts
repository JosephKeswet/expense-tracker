import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDto, SignUpDto, VerifyEmailDto } from 'src/shared/dto/auth';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { IResponse } from 'src/shared/types/response';
import * as argon2 from 'argon2';
import { OtpService } from 'src/otp/otp.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private data: PrismaService,
    private jwtService: JwtService,
    private otpService: OtpService,
    private emailService: EmailService,
  ) {}

  async signIn({ email, password }: SignInDto): Promise<IResponse> {
    const user = await this.data.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        message: 'User not found',
        status: 404,
        state: 'error',
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
      state: 'success',
      token,
    };
  }

  async signUp(signUpDto: SignUpDto): Promise<IResponse> {
    const { email, password, userName } = signUpDto;

    const user = await this.data.user.findUnique({
      where: { email },
    });

    if (user) {
      return {
        message: 'User already exists',
        status: 400,
        state: 'error',
      };
    }

    const passwordHash = await argon2.hash(password);
    const verificationInfo = await this.otpService.generateKey();
    const hasedOtp = await argon2.hash(verificationInfo.otp);
    const newUser = await this.data.user.create({
      data: {
        email,
        passwordHash,
        userName,
        isEmailVerified: false,
        verificationOtp: hasedOtp,
      },
    });

    const { passwordHash: _, ...result } = newUser;

    await this.sendOtp(email, verificationInfo);

    return {
      data: result,
      message: `You will receive an OTP at ${email} to verify your account`,
      status: 201,
      state: 'success',
    };
  }
  async verifyEmail({ email, otp }: VerifyEmailDto): Promise<any> {
    // Check if email exists
    const user = await this.data.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      return {
        message: 'User not found',
        status: 404,
        state: 'error',
      };
    }

    const isOtpVerified = await argon2.verify(user.verificationOtp, otp);

    if (!isOtpVerified) {
      return {
        message: 'Invalid otp',
        status: 403,
      };
    }
    // await this.verifyOtp(email, otp);
    await this.data.user.update({
      data: {
        isEmailVerified: true,
      },
      where: {
        email,
      },
    });
    return {
      message: 'Email verified successfully',
      status: 200,
      state: 'success',
    };
  }

  async sendOtp(
    email: string,
    verificationInfo: { otp: string; secret: string },
  ): Promise<IResponse> {
    await this.emailService.sendEmail(
      email,
      'OTP Verification',
      `Your verification OTP for expense tracker is ${verificationInfo.otp} and ${verificationInfo.secret}`,
    );

    return {
      message: `OTP sent to ${email} successfully`,
      status: 200,
      state: 'success',
    };
  }

  async verifyOtp(email: string, otp: string): Promise<IResponse> {
    await this.otpService.verifyOtp(email, otp);
    return {
      message: 'OTP verified successfully',
      status: 200,
      state: 'success',
    };
  }
}
