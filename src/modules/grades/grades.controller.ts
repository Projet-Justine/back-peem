import { Controller, Get, Post, Put, Patch, Body, Param, Query, Req } from '@nestjs/common';
import { GradesService } from './grades.service';
import { GradePublicationStatus, ClaimStatus } from '../../common/enums';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { extractUserId } from '../../common/auth-helper';

@ApiTags('grades')
@Controller('api/v1/grades')
export class GradesController {
  constructor(private gradesService: GradesService) {}

  @Get('me/results')
  @ApiOperation({ summary: 'Notes et moyennes de l étudiant connecté' })
  async getMyResults(@Req() req: any, @Query('userId') queryUserId?: string) {
    const userId = extractUserId(req, queryUserId);
    return this.gradesService.getMyResults(userId);
  }

  @Get('me/transcript')
  @ApiOperation({ summary: 'Relevé de notes officiel de l étudiant connecté' })
  async getMyTranscript(@Req() req: any, @Query('userId') queryUserId?: string) {
    const userId = extractUserId(req, queryUserId);
    return this.gradesService.getStudentTranscript(userId);
  }

  @Get('admin/all')
  @ApiOperation({ summary: 'Toutes les notes pour administration et validation' })
  async getAllGradesAdmin() {
    return this.gradesService.getAllGradesAdmin();
  }

  @Post('batch')
  @ApiOperation({ summary: 'Enregistrement direct en lot de notes' })
  async saveBatchDirect(@Body() body: { evaluationId: string; grades: any[]; statut?: GradePublicationStatus }, @Req() req: any) {
    const userId = extractUserId(req);
    return this.gradesService.saveBatchGradesDirect({
      evaluationId: body.evaluationId,
      grades: body.grades || [],
      saisieParId: userId,
      statut: body.statut,
    });
  }

  @Patch(':id/:action')
  @ApiOperation({ summary: 'Changer le statut d une note dans le workflow (valider, publier, etc.)' })
  async updateGradeWorkflow(
    @Param('id') id: string,
    @Param('action') action: string,
    @Req() req: any,
  ) {
    const userId = extractUserId(req);
    return this.gradesService.updateGradeWorkflow(id, action, userId);
  }

  @Get('evaluations')
  @ApiOperation({ summary: 'Lister les évaluations' })
  async getEvaluations(@Query('ueId') ueId?: string, @Query('enseignantId') enseignantId?: string) {
    return this.gradesService.getEvaluations({ ueId, enseignantId });
  }

  @Post('evaluations')
  @ApiOperation({ summary: 'Créer une évaluation (examen, TP, CC)' })
  async createEvaluation(@Body() body: any) {
    return this.gradesService.createEvaluation(body);
  }

  @Get('evaluation/:id')
  @ApiOperation({ summary: 'Notes des étudiants pour une évaluation' })
  async getGradesByEvaluation(@Param('id') id: string) {
    return this.gradesService.getGradesByEvaluation(id);
  }

  @Post('evaluation/:id/batch')
  @ApiOperation({ summary: 'Saisie de notes en lot par l enseignant' })
  async batchSaveGrades(
    @Param('id') evaluationId: string,
    @Body()
    body: {
      grades: Array<{ etudiantId: string; valeur?: number; statutPresence?: any }>;
      saisieParId?: string;
      statutPublication?: GradePublicationStatus;
    },
    @Req() req: any,
  ) {
    const saisieParId = extractUserId(req, body.saisieParId);
    return this.gradesService.batchSaveGrades(
      evaluationId,
      body.grades,
      saisieParId,
      body.statutPublication,
    );
  }

  @Put('evaluation/:id/status')
  @ApiOperation({ summary: 'Circuit de validation 3 niveaux (Brouillon -> Soumis -> Validé -> Publié -> Verrouillé)' })
  async changeStatus(
    @Param('id') evaluationId: string,
    @Body() body: { status: GradePublicationStatus },
  ) {
    return this.gradesService.updateEvaluationStatus(
      evaluationId,
      body.status,
    );
  }

  @Get('student/:id/transcript')
  @ApiOperation({ summary: 'Relevé de notes officiel de l étudiant' })
  async getStudentTranscript(@Param('id') id: string) {
    return this.gradesService.getStudentTranscript(id);
  }

  @Get('claims')
  @ApiOperation({ summary: 'Lister toutes les réclamations de notes' })
  async getClaims() {
    return this.gradesService.getAllClaims();
  }

  @Post('claims')
  @ApiOperation({ summary: 'Déposer une réclamation sur une note' })
  async submitClaim(
    @Body() body: { noteId?: string; gradeId?: string; etudiantId?: string; motif: string },
    @Req() req: any,
  ) {
    const noteId = body.noteId || body.gradeId;
    const etudiantId = extractUserId(req, body.etudiantId);
    return this.gradesService.submitClaim(noteId!, etudiantId, body.motif);
  }

  @Put('claims/:id')
  @ApiOperation({ summary: 'Traiter une réclamation (Accepter/Refuser)' })
  async updateClaim(
    @Param('id') claimId: string,
    @Body() body: { statut: ClaimStatus; reponse: string; traiteParId?: string },
    @Req() req: any,
  ) {
    const traiteParId = extractUserId(req, body.traiteParId);
    return this.gradesService.updateClaim(
      claimId,
      body.statut,
      body.reponse,
      traiteParId,
    );
  }
}
