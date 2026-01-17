import { PrismaService } from '@/core/infrastructure/database/prisma/prisma.service';
import { SupabaseService } from '@/core/infrastructure/storage/supabase/supabase.service';
import type { User } from '@2care/types';
import { Injectable } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private supabase: SupabaseService,
  ) {}

  async getMyProfile(userId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      omit: { password: true },
    });

    return user;
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
    file?: Express.Multer.File,
  ): Promise<User> {
    let avatarUrl: string | undefined;

    if (file) {
      const currentUser = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { avatar: true },
      });

      avatarUrl = await this.supabase.uploadAvatar(userId, file);

      if (currentUser?.avatar) {
        await this.supabase.deleteAvatar(currentUser.avatar);
      }
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...updateProfileDto,
        ...(avatarUrl && { avatar: avatarUrl }),
      },
      omit: { password: true },
    });

    return user;
  }

  async uploadAvatar(userId: string, file: Express.Multer.File): Promise<User> {
    const currentUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { avatar: true },
    });

    const avatarUrl = await this.supabase.uploadAvatar(userId, file);

    if (currentUser?.avatar) {
      await this.supabase.deleteAvatar(currentUser.avatar);
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
      omit: { password: true },
    });

    return user;
  }

  async deleteAvatar(userId: string): Promise<User> {
    const currentUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { avatar: true },
    });

    if (currentUser?.avatar) {
      await this.supabase.deleteAvatar(currentUser.avatar);
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { avatar: null },
      omit: { password: true },
    });

    return user;
  }
}
