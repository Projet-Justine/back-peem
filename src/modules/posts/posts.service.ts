import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post, PostTarget, PostComment, PostLike, User } from '../../entities';
import { PostType, PostStatus } from '../../common/enums';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(PostTarget) private targetRepo: Repository<PostTarget>,
    @InjectRepository(PostComment) private commentRepo: Repository<PostComment>,
    @InjectRepository(PostLike) private likeRepo: Repository<PostLike>,
  ) {}

  async getFeed(tab = 'officiel', filiere?: string, niveau?: string) {
    const qb = this.postRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.auteur', 'auteur')
      .leftJoinAndSelect('p.cibles', 'cibles')
      .leftJoinAndSelect('p.commentaires', 'commentaires')
      .leftJoinAndSelect('commentaires.auteur', 'commentAuteur')
      .leftJoinAndSelect('p.reactions', 'reactions')
      .leftJoinAndSelect('reactions.user', 'reactionUser')
      .where('p.statut = :statut', { statut: PostStatus.PUBLIE });

    return qb
      .orderBy('p.epingle', 'DESC')
      .addOrderBy('p.datePublication', 'DESC')
      .getMany();
  }

  async create(data: Partial<Post>, auteurId: string, targets?: Array<{ filiere?: string; niveau?: string }>) {
    const post = this.postRepo.create({
      ...data,
      auteurId,
      statut: PostStatus.PUBLIE,
      datePublication: new Date(),
    });
    const savedPost = await this.postRepo.save(post);

    if (targets && targets.length > 0) {
      const targetEntities = targets.map((t) =>
        this.targetRepo.create({
          postId: savedPost.id,
          filiere: t.filiere,
          niveau: t.niveau,
        }),
      );
      await this.targetRepo.save(targetEntities);
    }

    return this.postRepo.findOne({
      where: { id: savedPost.id },
      relations: {
        auteur: true,
        cibles: true,
        commentaires: true,
        reactions: true,
      },
    });
  }

  async addComment(postId: string, auteurId: string, contenu: string) {
    const comment = this.commentRepo.create({
      postId,
      auteurId,
      contenu,
    });
    const saved = await this.commentRepo.save(comment);
    return this.commentRepo.findOne({
      where: { id: saved.id },
      relations: { auteur: true },
    });
  }

  async toggleLike(postId: string, userId: string, type = 'LIKE') {
    const existing = await this.likeRepo.findOne({
      where: { postId, userId },
    });
    if (existing) {
      if (existing.type === type) {
        await this.likeRepo.remove(existing);
        return { action: 'removed' };
      } else {
        existing.type = type;
        await this.likeRepo.save(existing);
        return { action: 'updated', type };
      }
    } else {
      const like = this.likeRepo.create({ postId, userId, type });
      await this.likeRepo.save(like);
      return { action: 'added', type };
    }
  }
}
