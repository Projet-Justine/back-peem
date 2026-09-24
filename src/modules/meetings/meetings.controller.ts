import { Controller, Get, Post, Body, Param, Query, Req } from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { extractUserId } from '../../common/auth-helper';

@ApiTags('meetings')
@Controller('api/v1/meetings')
export class MeetingsController {
  constructor(private meetingsService: MeetingsService) {}

  @Get()
  @ApiOperation({ summary: 'Lister les réunions et visioconférences' })
  async getMeetings(@Query('groupeId') groupeId?: string) {
    return this.meetingsService.findAll(groupeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détails d une réunion' })
  async getMeeting(@Param('id') id: string) {
    return this.meetingsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Créer une réunion vidéo avec lien Meet' })
  async createMeeting(@Body() body: any, @Req() req: any) {
    const data = body.data || body;
    const hoteId = extractUserId(req, body.hoteId || data.hoteId);
    return this.meetingsService.create(data, hoteId);
  }

  @Post(':id/join')
  @ApiOperation({ summary: 'Rejoindre une réunion et enregistrer la feuille de présence' })
  async joinMeeting(
    @Param('id') id: string,
    @Body() body: { userId?: string },
    @Req() req: any,
  ) {
    const userId = extractUserId(req, body?.userId);
    return this.meetingsService.join(id, userId);
  }
}
