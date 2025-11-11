import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { BabiesModule } from './modules/babies/babies.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { FamiliesModule } from './modules/families/families.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { HealthModule } from './modules/health/health.module';
import { PrismaModule } from './core/infrastructure/database/prisma/prisma.module';
import { PrismaService } from './core/infrastructure/database/prisma.service';

@Module({
  imports: [
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
  providers: [AppService, PrismaService],
})
export class AppModule {}
