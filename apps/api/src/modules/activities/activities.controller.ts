import { GetUser } from '@/common/decorators/get-user.decorator';
import type { Activity, PaginatedResponse } from '@2care/types';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { ListActivitiesDto } from './dto/list-activities.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@ApiTags('activities')
@Controller({ path: 'activities', version: '1' })
@ApiBearerAuth()
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Activity created successfully' })
  createActivity(
    @Body() createActivityDto: CreateActivityDto,
    @GetUser() userId: string,
  ): Promise<Activity> {
    return this.activitiesService.createActivity(createActivityDto, userId);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Activity updated successfully' })
  updateActivity(
    @Param('id') id: string,
    @Body() updateActivityDto: UpdateActivityDto,
    @GetUser() userId: string,
  ): Promise<Activity> {
    return this.activitiesService.updateActivity(id, updateActivityDto, userId);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Activity retrieved successfully' })
  getActivityById(
    @Param('id') id: string,
    @GetUser() userId: string,
  ): Promise<Activity> {
    return this.activitiesService.getActivityById(id, userId);
  }

  @Get()
  @ApiOkResponse({ description: 'Activities retrieved successfully' })
  listActivities(
    @Query() query: ListActivitiesDto,
    @GetUser() userId: string,
  ): Promise<PaginatedResponse<Activity>> {
    return this.activitiesService.listActivities(query, userId);
  }
}
