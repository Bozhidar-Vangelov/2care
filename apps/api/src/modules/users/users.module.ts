import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '@/core/infrastructure/database/prisma/prisma.module';
import { SupabaseModule } from '@/core/infrastructure/storage/supabase/supabase.module';

@Module({
  imports: [PrismaModule, SupabaseModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
