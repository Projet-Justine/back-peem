import { Controller, Get, Post, Delete, Body, Param, Query, Req } from '@nestjs/common';
import { FilesService } from './files.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { extractUserId } from '../../common/auth-helper';

@ApiTags('files')
@Controller('api/v1/files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Get()
  @ApiOperation({ summary: 'Explorateur de dossiers et fichiers pour un groupe / classe' })
  async getExplorer(
    @Query('groupeId') groupeId?: string,
    @Query('parentId') parentId?: string,
  ) {
    return this.filesService.getExplorer(groupeId, parentId);
  }

  @Get('folders')
  @ApiOperation({ summary: 'Lister les dossiers' })
  async getFolders(@Query('groupeId') groupeId?: string) {
    return this.filesService.getAllFolders(groupeId);
  }

  @Get('folders/:id/files')
  @ApiOperation({ summary: 'Lister les fichiers d un dossier' })
  async getFilesInFolder(@Param('id') id: string) {
    return this.filesService.getFilesInFolder(id);
  }

  @Post('folders/:id/files')
  @ApiOperation({ summary: 'Ajouter un fichier dans un dossier' })
  async addFileToFolder(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    const proprietaireId = extractUserId(req, body.proprietaireId);
    return this.filesService.createFile({ ...body, dossierId: id, proprietaireId });
  }

  @Post('folder')
  @ApiOperation({ summary: 'Créer un dossier' })
  async createFolder(
    @Body()
    body: {
      nom: string;
      groupeId?: string;
      parentId?: string;
      proprietaireId?: string;
    },
    @Req() req: any,
  ) {
    const proprietaireId = extractUserId(req, body.proprietaireId);
    return this.filesService.createFolder(
      body.nom,
      body.groupeId,
      body.parentId,
      proprietaireId,
    );
  }

  @Post('folders')
  @ApiOperation({ summary: 'Créer un dossier (alias pluriel)' })
  async createFolderPlural(
    @Body()
    body: {
      nom: string;
      groupeId?: string;
      parentId?: string;
      proprietaireId?: string;
    },
    @Req() req: any,
  ) {
    const proprietaireId = extractUserId(req, body.proprietaireId);
    return this.filesService.createFolder(
      body.nom,
      body.groupeId,
      body.parentId,
      proprietaireId,
    );
  }

  @Post('file')
  @ApiOperation({ summary: 'Enregistrer un fichier déposé' })
  async createFile(@Body() body: any, @Req() req: any) {
    const proprietaireId = extractUserId(req, body.proprietaireId);
    return this.filesService.createFile({ ...body, proprietaireId });
  }

  @Get('upload-url')
  @ApiOperation({ summary: 'Obtenir une URL présignée pour upload S3 / MinIO' })
  async getUploadUrl(
    @Query('fileName') fileName = 'document.pdf',
    @Query('typeMime') typeMime = 'application/pdf',
  ) {
    return this.filesService.getUploadUrl(fileName, typeMime);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un fichier' })
  async deleteFile(@Param('id') id: string) {
    return this.filesService.deleteFile(id);
  }
}
