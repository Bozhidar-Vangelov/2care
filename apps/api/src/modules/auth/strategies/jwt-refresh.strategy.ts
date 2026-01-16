import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { PrismaService } from '../../../core/infrastructure/database/prisma/prisma.service';

export interface JwtRefreshPayload {
  sub: string;
  email: string;
  role: string;
  tokenId: string;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(_req: Request, payload: JwtRefreshPayload) {
    // Verify the refresh token exists and is not revoked
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { id: payload.tokenId },
      include: { user: true },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (storedToken.revoked) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    if (storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token has expired');
    }

    if (storedToken.userId !== payload.sub) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return {
      id: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role,
      firstName: storedToken.user.firstName,
      lastName: storedToken.user.lastName,
      tokenId: payload.tokenId,
    };
  }
}
