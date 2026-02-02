import { GetUser } from '@/common/decorators/get-user.decorator';
import { ImageValidationPipe } from '@/common/pipes/image-validation.pipe';
import type { Baby } from '@2care/types';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BabiesService } from './babies.service';
import { CreateBabyDto } from './dto/create-baby.dto';
import { UpdateBabyDto } from './dto/update-baby.dto';

@ApiTags('babies')
@Controller({ path: 'babies', version: '1' })
@ApiBearerAuth()
export class BabiesController {
  constructor(private readonly babiesService: BabiesService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Baby created successfully' })
  createBaby(
    @Body() createBabyDto: CreateBabyDto,
    @GetUser() userId: string,
  ): Promise<Baby> {
    return this.babiesService.createBaby(createBabyDto, userId);
  }

  @Get()
  @ApiOkResponse({ description: 'User babies retrieved successfully' })
  getUserBabies(@GetUser() userId: string): Promise<Baby[]> {
    return this.babiesService.getUserBabies(userId);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Baby retrieved successfully' })
  getBabyById(
    @Param('id') id: string,
    @GetUser() userId: string,
  ): Promise<Baby> {
    return this.babiesService.getBabyById(id, userId);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Baby updated successfully' })
  updateBaby(
    @Param('id') id: string,
    @Body() updateBabyDto: UpdateBabyDto,
    @GetUser() userId: string,
  ): Promise<Baby> {
    return this.babiesService.updateBaby(id, updateBabyDto, userId);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Baby deleted successfully' })
  async softDeleteBaby(
    @Param('id') id: string,
    @GetUser() userId: string,
  ): Promise<void> {
    return this.babiesService.softDeleteBaby(id, userId);
  }

  @Post(':id/photo')
  @UseInterceptors(FileInterceptor('photo'))
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ description: 'Baby photo uploaded successfully' })
  async uploadBabyPhoto(
    @Param('id') id: string,
    @UploadedFile(ImageValidationPipe) file: Express.Multer.File,
    @GetUser() userId: string,
  ): Promise<{ id: string; photoUrl: string; createdAt: Date }> {
    return this.babiesService.uploadBabyPhoto(id, file, userId);
  }

  @Get(':id/photos')
  @ApiOkResponse({ description: 'Baby photos retrieved successfully' })
  async getBabyPhotos(
    @Param('id') id: string,
    @GetUser() userId: string,
  ): Promise<Array<{ id: string; photoUrl: string; createdAt: Date }>> {
    return this.babiesService.getBabyPhotos(id, userId);
  }
}
