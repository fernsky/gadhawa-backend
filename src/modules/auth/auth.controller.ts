import { Body, Controller, Post, UsePipes, Version } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginDto,
  LoginSchema,
  SignupDto,
  SignupSchema,
  AuthResponseDto,
} from './dto';
import { ZodValidationPipe } from '../../common/pipes/zod.pipe';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @Version('1')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: SignupDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @UsePipes(new ZodValidationPipe(SignupSchema))
  async signup(@Body() body: SignupDto) {
    console.log('Controller: Raw request body:', body);
    try {
      const result = await this.authService.signup(body);
      console.log('Controller: Signup completed', result);
      return result;
    } catch (error) {
      console.error('Controller: Signup error:', error);
      throw error;
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Log in with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @UsePipes(new ZodValidationPipe(LoginSchema))
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }
}
