import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import {
  calculateExpirationDate,
  parseExpiresIn,
} from '../../common/utils/jwt.util';
import { PrismaService } from '../../core/infrastructure/database/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName } = registerDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user,
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      ...tokens,
    };
  }

  async refreshTokens(userId: string, tokenId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Revoke the old refresh token
    await this.prisma.refreshToken.update({
      where: { id: tokenId },
      data: { revoked: true },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      ...tokens,
    };
  }

  async logout(userId: string, tokenId?: string) {
    if (tokenId) {
      await this.prisma.refreshToken.update({
        where: { id: tokenId },
        data: { revoked: true },
      });
    } else {
      await this.prisma.refreshToken.updateMany({
        where: { userId, revoked: false },
        data: { revoked: true },
      });
    }

    return { message: 'Successfully logged out' };
  }

  async logoutAll(userId: string) {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    });

    return { message: 'Successfully logged out from all devices' };
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const tokenId = uuidv4();
    const payload = { sub: userId, email, role };

    const accessToken = this.jwtService.sign(payload);

    const refreshTokenPayload = { ...payload, tokenId };
    const refreshExpiresIn =
      this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d';
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');

    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      secret: refreshSecret,
      expiresIn: parseExpiresIn(refreshExpiresIn),
    });

    const expiresAt = calculateExpirationDate(refreshExpiresIn);

    await this.prisma.refreshToken.create({
      data: {
        id: tokenId,
        token: refreshToken,
        userId,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
