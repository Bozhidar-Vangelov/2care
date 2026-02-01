import { PrismaModule } from '@/core/infrastructure/database/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { BabiesService } from './babies.service';
import { BabiesController } from './babies.controller';

@Module({
  imports: [PrismaModule],
  controllers: [BabiesController],
  providers: [BabiesService],
})
export class BabiesModule {}
