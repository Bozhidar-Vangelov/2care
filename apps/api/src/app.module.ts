import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import type { Request, Response } from 'express';
import { LoggerModule } from 'nestjs-pino';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validateEnv } from './config/validation.schema';
import { PrismaModule } from './core/infrastructure/database/prisma/prisma.module';
import { PrismaService } from './core/infrastructure/database/prisma/prisma.service';
import { ActivitiesModule } from './modules/activities/activities.module';
import { AuthModule } from './modules/auth/auth.module';
import { BabiesModule } from './modules/babies/babies.module';
import { FamiliesModule } from './modules/families/families.module';
import { HealthModule } from './modules/health/health.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { UsersModule } from './modules/users/users.module';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import jwtConfig from './config/jwt.config';
import supabaseConfig from './config/supabase.config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { JwtStrategy } from './modules/auth/strategies/jwt.strategy';
import {
  RATE_LIMIT_DEFAULT,
  RATE_LIMIT_TTL,
} from './common/constants/rate-limit.constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validate: validateEnv,
      load: [appConfig, databaseConfig, jwtConfig, supabaseConfig],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: RATE_LIMIT_TTL,
        limit: RATE_LIMIT_DEFAULT,
      },
    ]),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  singleLine: true,
                  translateTime: 'SYS:standard',
                  ignore: 'pid,hostname',
                },
              }
            : undefined,
        customProps: () => ({
          context: 'HTTP',
        }),
        serializers: {
          req(req: Request) {
            return {
              id: req.id,
              method: req.method,
              url: req.url,
            };
          },
          res(res: Response) {
            return {
              statusCode: res.statusCode,
            };
          },
        },
      },
    }),
    UsersModule,
    AuthModule,
    BabiesModule,
    ActivitiesModule,
    FamiliesModule,
    NotificationsModule,
    HealthModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    PrismaService,
    JwtStrategy,
  ],
})
export class AppModule {}
