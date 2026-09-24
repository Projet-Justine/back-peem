import { Controller, Get, Post, Body, Param, Query, Req } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { extractUserId } from '../../common/auth-helper';

@ApiTags('groups')
@Controller('api/v1/groups')
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  @Get()
  @ApiOperation({ summary: 'Lister les groupes (avec filtre optionnel par utilisateur)' })
  async getGroups(@Query('userId') userId?: string) {
    return this.groupsService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détails d un groupe avec membres et canaux' })
  async getGroup(@Param('id') id: string) {
    return this.groupsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Créer un groupe' })
  async createGroup(
    @Body() body: any,
    @Req() req: any,
  ) {
    const data = body.data || body;
    const userId = extractUserId(req, body.userId || data.userId);
    return this.groupsService.create(data, userId);
  }

  @Post(':id/join')
  @ApiOperation({ summary: 'Rejoindre un groupe par ID' })
  async joinGroup(
    @Param('id') id: string,
    @Body() body: { userId?: string },
    @Req() req: any,
  ) {
    const userId = extractUserId(req, body?.userId);
    return this.groupsService.joinGroup(id, userId);
  }

  @Post('join')
  @ApiOperation({ summary: 'Rejoindre un groupe par code d invitation' })
  async joinByCode(@Body() body: { code: string; userId?: string }, @Req() req: any) {
    const userId = extractUserId(req, body.userId);
    return this.groupsService.joinByCode(body.code, userId);
  }
}
