import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Public } from '../../common/decorators/public.decorator';
import { JwtRefreshGuard } from '../../common/guards/jwt-refresh.guard';
import {
  RATE_LIMIT_LOGIN,
  RATE_LIMIT_REFRESH,
  RATE_LIMIT_REGISTER,
  RATE_LIMIT_TTL,
} from '../../common/constants/rate-limit.constants';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Throttle({ default: { limit: RATE_LIMIT_REGISTER, ttl: RATE_LIMIT_TTL } })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Public()
  @Throttle({ default: { limit: RATE_LIMIT_LOGIN, ttl: RATE_LIMIT_TTL } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Successfully logged in' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Public()
  @Throttle({ default: { limit: RATE_LIMIT_REFRESH, ttl: RATE_LIMIT_TTL } })
  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Tokens successfully refreshed' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refreshTokens(
    @Body() _refreshTokenDto: RefreshTokenDto,
    @Req() req: { user: { id: string; tokenId: string } },
  ) {
    return await this.authService.refreshTokens(req.user.id, req.user.tokenId);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user (revoke current refresh token)' })
  @ApiResponse({ status: 200, description: 'Successfully logged out' })
  async logout(@Req() req: { user: { id: string } }) {
    return await this.authService.logout(req.user.id);
  }

  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Logout from all devices (revoke all refresh tokens)',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged out from all devices',
  })
  async logoutAll(@Req() req: { user: { id: string } }) {
    return await this.authService.logoutAll(req.user.id);
  }
}
