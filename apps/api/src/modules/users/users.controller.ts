import { GetUser } from '@/common/decorators/get-user.decorator';
import type { User } from '@2care/types';
import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOkResponse({ description: 'User profile retrieved successfully' })
  async getMyProfile(@GetUser() userId: string): Promise<User> {
    return this.usersService.getMyProfile(userId);
  }
}
