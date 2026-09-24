import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, Req } from '@nestjs/common';
import { SocialService } from './social.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { extractUserId } from '../../common/auth-helper';

@ApiTags('social')
@Controller('api/v1/social')
export class SocialController {
  constructor(private socialService: SocialService) {}

  @Get('friends')
  @ApiOperation({ summary: 'Lister les amis d un utilisateur' })
  async getFriendsQuery(@Query('userId') queryUserId: string, @Req() req: any) {
    const userId = extractUserId(req, queryUserId);
    return this.socialService.getFriends(userId);
  }

  @Get('friends/:userId')
  @ApiOperation({ summary: 'Lister les amis d un utilisateur par paramètre' })
  async getFriendsParam(@Param('userId') paramUserId: string, @Req() req: any) {
    const userId = paramUserId === 'me' ? extractUserId(req) : extractUserId(req, paramUserId);
    return this.socialService.getFriends(userId);
  }

  @Get('friend-requests')
  @ApiOperation({ summary: 'Demandes d amis en attente' })
  async getFriendRequests(@Req() req: any, @Query('userId') queryUserId?: string) {
    const userId = extractUserId(req, queryUserId);
    return this.socialService.getFriendRequests(userId);
  }

  @Get('suggestions')
  @ApiOperation({ summary: 'Suggestions d amis de la promotion' })
  async getSuggestions(@Req() req: any, @Query('userId') queryUserId?: string) {
    const userId = extractUserId(req, queryUserId);
    return this.socialService.getSuggestions(userId);
  }

  @Post('friends')
  @ApiOperation({ summary: 'Envoyer une demande d ami' })
  async sendRequestDirect(@Body() body: { userAId?: string; userBId: string }, @Req() req: any) {
    const userAId = extractUserId(req, body.userAId);
    return this.socialService.sendFriendRequest(userAId, body.userBId);
  }

  @Post('friends/request')
  @ApiOperation({ summary: 'Envoyer une demande d ami (alias)' })
  async sendRequest(@Body() body: { userAId?: string; userBId: string }, @Req() req: any) {
    const userAId = extractUserId(req, body.userAId);
    return this.socialService.sendFriendRequest(userAId, body.userBId);
  }

  @Patch('friends/:id')
  @ApiOperation({ summary: 'Accepter ou refuser une demande d ami par patch' })
  async patchFriendRequest(
    @Param('id') id: string,
    @Body() body: { statut: any },
  ) {
    return this.socialService.updateFriendshipStatus(id, body.statut);
  }

  @Get('stories')
  @ApiOperation({ summary: 'Stories éphémères (24h)' })
  async getStories() {
    return this.socialService.getStories();
  }

  @Post('stories')
  @ApiOperation({ summary: 'Publier une story de 24h' })
  async createStory(
    @Body() body: { auteurId?: string; mediaUrl: string; type?: string; audience?: string },
    @Req() req: any,
  ) {
    const auteurId = extractUserId(req, body.auteurId);
    return this.socialService.createStory(
      auteurId,
      body.mediaUrl,
      body.type,
      body.audience,
    );
  }

  @Get('listings')
  @ApiOperation({ summary: 'Petites annonces étudiantes (livres, logement, cours, etc.)' })
  async getListings(@Query('category') category?: any) {
    return this.socialService.getListings(category);
  }

  @Post('listings')
  @ApiOperation({ summary: 'Déposer une petite annonce étudiante' })
  async createListing(@Body() body: any, @Req() req: any) {
    const data = body.data || body;
    const auteurId = extractUserId(req, body.vendeurId || body.auteurId || data.auteurId);
    return this.socialService.createListing(auteurId, data);
  }

  @Get('questions')
  @ApiOperation({ summary: 'Questions d entraide académique par UE' })
  async getQuestions(@Query('ueId') ueId?: string) {
    return this.socialService.getQuestions(ueId);
  }

  @Post('questions')
  @ApiOperation({ summary: 'Poser une question sur une UE' })
  async createQuestion(@Body() body: { auteurId?: string; data?: any; titre?: string; contenu?: string; ueId?: string }, @Req() req: any) {
    const auteurId = extractUserId(req, body.auteurId);
    const data = body.data || body;
    return this.socialService.createQuestion(auteurId, data);
  }

  @Post('questions/:id/answers')
  @ApiOperation({ summary: 'Répondre à une question d entraide' })
  async answerQuestion(
    @Param('id') questionId: string,
    @Body() body: { auteurId?: string; contenu: string },
    @Req() req: any,
  ) {
    const auteurId = extractUserId(req, body.auteurId);
    return this.socialService.answerQuestion(questionId, auteurId, body.contenu);
  }

  @Put('questions/:questionId/solution/:answerId')
  @ApiOperation({ summary: 'Marquer une réponse comme Solution acceptée' })
  async markSolution(
    @Param('questionId') questionId: string,
    @Param('answerId') answerId: string,
  ) {
    return this.socialService.markSolution(questionId, answerId);
  }

  @Get('wall')
  @ApiOperation({ summary: 'Mur de publications personnelles des étudiants' })
  async getWall(@Query('userId') queryUserId?: string, @Req() req?: any) {
    const userId = queryUserId ? extractUserId(req, queryUserId) : undefined;
    return this.socialService.getWallPosts(userId);
  }

  @Get('wall/:userId')
  @ApiOperation({ summary: 'Mur de publications personnelles d un étudiant' })
  async getWallByUser(@Param('userId') paramUserId: string, @Req() req: any) {
    const userId = paramUserId === 'me' ? extractUserId(req) : extractUserId(req, paramUserId);
    return this.socialService.getWallPosts(userId);
  }

  @Post('wall')
  @ApiOperation({ summary: 'Publier sur son mur personnel' })
  async createWallPost(@Body() body: any, @Req() req: any) {
    const auteurId = extractUserId(req, body.auteurId);
    return this.socialService.createWallPost(auteurId, body.contenu, body.mediaUrls || body.medias, body.audience);
  }

  @Post('wall/:id/reactions')
  @ApiOperation({ summary: 'Réagir à une publication de mur' })
  async reactWallPost(@Param('id') id: string) {
    return { success: true };
  }

  @Delete('wall/:id')
  @ApiOperation({ summary: 'Supprimer une publication de son mur' })
  async deleteWallPost(@Param('id') id: string) {
    return this.socialService.deleteWallPost(id);
  }

  @Patch('profile/:userId')
  @ApiOperation({ summary: 'Mettre à jour son profil social académique' })
  async updateProfile(@Param('userId') paramUserId: string, @Body() body: any, @Req() req: any) {
    const userId = paramUserId === 'me' ? extractUserId(req) : extractUserId(req, paramUserId);
    return this.socialService.updateProfile(userId, body);
  }
}
