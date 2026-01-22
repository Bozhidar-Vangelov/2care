import { GetUser } from '@/common/decorators/get-user.decorator';
import type { Family } from '@2care/types';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateFamilyDto } from './dto/create-family.dto';
import { CreateInviteDto } from './dto/create-invite.dto';
import { JoinFamilyDto } from './dto/join-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { FamiliesService } from './families.service';

@ApiTags('families')
@Controller({ path: 'families', version: '1' })
@ApiBearerAuth()
export class FamiliesController {
  constructor(private readonly familiesService: FamiliesService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Family created successfully' })
  createFamily(
    @Body() createFamilyDto: CreateFamilyDto,
    @GetUser() userId: string,
  ): Promise<Family> {
    return this.familiesService.createFamily(createFamilyDto, userId);
  }

  @Get()
  @ApiCreatedResponse({ description: 'Families retrieved successfully' })
  getUserFamilies(@GetUser() userId: string): Promise<Family[]> {
    return this.familiesService.getUserFamilies(userId);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Family retrieved successfully' })
  getFamilyById(
    @Param('id') id: string,
    @GetUser() userId: string,
  ): Promise<Family> {
    return this.familiesService.getFamilyById(id, userId);
  }

  @Get(':id/members')
  @ApiOkResponse({ description: 'Family members retrieved successfully' })
  getFamilyMembers(@Param('id') id: string, @GetUser() userId: string) {
    return this.familiesService.getFamilyMembers(id, userId);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Family updated successfully' })
  updateFamily(
    @Param('id') id: string,
    @Body() updateFamilyDto: UpdateFamilyDto,
    @GetUser() userId: string,
  ): Promise<Family> {
    return this.familiesService.updateFamily(id, updateFamilyDto, userId);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Family deleted successfully' })
  async softDeleteFamily(
    @Param('id') id: string,
    @GetUser() userId: string,
  ): Promise<void> {
    return this.familiesService.softDeleteFamily(id, userId);
  }

  @Post(':id/invite')
  @ApiCreatedResponse({
    description: 'Family invite link generated successfully',
    schema: {
      type: 'object',
      properties: {
        inviteLink: {
          type: 'string',
          example: 'http://localhost:3000/families/join/abc-123',
        },
        token: { type: 'string', example: 'abc-123' },
        expiresAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  createInvite(
    @Param('id') id: string,
    @Body() createInviteDto: CreateInviteDto,
    @GetUser() userId: string,
  ): Promise<{ inviteLink: string; token: string; expiresAt: Date }> {
    return this.familiesService.generateInviteLink(id, createInviteDto, userId);
  }

  @Post('join')
  @ApiCreatedResponse({ description: 'Successfully joined family' })
  joinFamily(
    @Body() joinFamilyDto: JoinFamilyDto,
    @GetUser() userId: string,
  ): Promise<Family> {
    return this.familiesService.joinFamily(joinFamilyDto, userId);
  }
}
