import { Controller, Get, Post, Put, Body, Param, Query, Req } from '@nestjs/common';
import { AcademicService } from './academic.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { extractUserId } from '../../common/auth-helper';

@ApiTags('academic')
@Controller('api/v1/academic')
export class AcademicController {
  constructor(private academicService: AcademicService) {}

  @Get('ue')
  @ApiOperation({ summary: 'Lister les unités d enseignement (UE)' })
  async getUEs(
    @Query('filiere') filiere?: string,
    @Query('niveau') niveau?: string,
    @Query('semestre') semestre?: string,
  ) {
    return this.academicService.findAllUE({ filiere, niveau, semestre });
  }

  @Get('ue/:id')
  @ApiOperation({ summary: 'Détails d une UE avec ECs et responsable' })
  async getOneUE(@Param('id') id: string) {
    return this.academicService.findOneUE(id);
  }

  @Post('ue')
  @ApiOperation({ summary: 'Créer une nouvelle UE par l administration' })
  async createUE(@Body() body: any) {
    return this.academicService.createUE(body);
  }

  @Put('ue/:id')
  @ApiOperation({ summary: 'Mettre à jour une UE' })
  async updateUE(@Param('id') id: string, @Body() body: any) {
    return this.academicService.updateUE(id, body);
  }

  @Post('enroll')
  @ApiOperation({ summary: 'Inscription pédagogique à une UE' })
  async enroll(@Body() body: { etudiantId?: string; ueId: string; annee?: string }, @Req() req: any) {
    const etudiantId = extractUserId(req, body.etudiantId);
    return this.academicService.enrollStudent(etudiantId, body.ueId, body.annee);
  }

  @Post('ue/:id/enroll')
  @ApiOperation({ summary: 'Inscription pédagogique à une UE par ID' })
  async enrollByUeId(
    @Param('id') ueId: string,
    @Body() body: { etudiantId?: string; annee?: string },
    @Query('etudiantId') queryEtudiantId?: string,
    @Req() req?: any,
  ) {
    const etudiantId = extractUserId(req, body.etudiantId || queryEtudiantId);
    return this.academicService.enrollStudent(etudiantId, ueId, body.annee);
  }

  @Get('enrollments/me')
  @ApiOperation({ summary: 'Mes inscriptions' })
  async getMyEnrollments(@Query('etudiantId') queryEtudiantId?: string, @Req() req?: any) {
    const etudiantId = extractUserId(req, queryEtudiantId);
    return this.academicService.getStudentEnrollments(etudiantId);
  }

  @Get('student/:id/enrollments')
  @ApiOperation({ summary: 'Inscriptions d un étudiant' })
  async getStudentEnrollments(@Param('id') id: string) {
    return this.academicService.getStudentEnrollments(id);
  }
}
