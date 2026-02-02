import { PrismaModule } from '@/core/infrastructure/database/prisma/prisma.module';
import { SupabaseModule } from '@/core/infrastructure/storage/supabase/supabase.module';
import { Module } from '@nestjs/common';
import { BabiesService } from './babies.service';
import { BabiesController } from './babies.controller';

@Module({
  imports: [PrismaModule, SupabaseModule],
  controllers: [BabiesController],
  providers: [BabiesService],
})
export class BabiesModule {}
