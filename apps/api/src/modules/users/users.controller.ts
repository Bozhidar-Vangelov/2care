import { GetUser } from '@/common/decorators/get-user.decorator';
import { ImageValidationPipe } from '@/common/pipes/image-validation.pipe';
import type { User } from '@2care/types';
import {
  Controller,
  Delete,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
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

  @Post('me/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponse({ description: 'Avatar uploaded successfully' })
  async uploadAvatar(
    @GetUser() userId: string,
    @UploadedFile(ImageValidationPipe) file: Express.Multer.File,
  ): Promise<User> {
    return await this.usersService.uploadAvatar(userId, file);
  }

  @Delete('me/avatar')
  @ApiOkResponse({ description: 'Avatar deleted successfully' })
  async deleteAvatar(@GetUser() userId: string): Promise<User> {
    return await this.usersService.deleteAvatar(userId);
  }
}
