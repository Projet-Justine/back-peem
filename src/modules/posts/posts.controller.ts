import { Controller, Get, Post, Body, Param, Query, Req } from '@nestjs/common';
import { PostsService } from './posts.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { extractUserId } from '../../common/auth-helper';

@ApiTags('posts')
@Controller('api/v1/posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  @ApiOperation({ summary: 'Fil d actualité (avec onglets: officiel, amis, groupes)' })
  async getFeed(
    @Query('tab') tab?: string,
    @Query('filiere') filiere?: string,
    @Query('niveau') niveau?: string,
  ) {
    return this.postsService.getFeed(tab, filiere, niveau);
  }

  @Post()
  @ApiOperation({ summary: 'Publier une annonce / information officielle' })
  async createPost(
    @Body() body: any,
    @Req() req: any,
  ) {
    const data = body.data || body;
    const targets = body.targets || data.targets;
    const auteurId = extractUserId(req, body.auteurId || data.auteurId);
    return this.postsService.create(data, auteurId, targets);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Commenter une publication' })
  async addComment(
    @Param('id') postId: string,
    @Body() body: { auteurId?: string; contenu: string },
    @Req() req: any,
  ) {
    const auteurId = extractUserId(req, body.auteurId);
    return this.postsService.addComment(postId, auteurId, body.contenu);
  }

  @Post(':id/like')
  @ApiOperation({ summary: 'Réagir à une publication (J aime, Utile, Merci)' })
  async toggleLike(
    @Param('id') postId: string,
    @Body() body: { userId?: string; type?: string },
    @Req() req: any,
  ) {
    const userId = extractUserId(req, body.userId);
    return this.postsService.toggleLike(postId, userId, body.type);
  }
}
