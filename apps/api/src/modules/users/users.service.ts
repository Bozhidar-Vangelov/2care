import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/infrastructure/database/prisma/prisma.service';
import type { User } from '@2care/types';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getMyProfile(userId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      omit: { password: true },
    });

    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
