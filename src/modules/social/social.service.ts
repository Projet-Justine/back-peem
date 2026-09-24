import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Friendship,
  Story,
  Listing,
  QAQuestion,
  QAAnswer,
  WallPost,
  SharedResource,
  User,
  Profile,
} from '../../entities';
import {
  RelationStatus,
  RelationType,
  ListingStatus,
  PostAudience,
  AvailabilityStatus,
} from '../../common/enums';

@Injectable()
export class SocialService {
  constructor(
    @InjectRepository(Friendship) private friendRepo: Repository<Friendship>,
    @InjectRepository(Story) private storyRepo: Repository<Story>,
    @InjectRepository(Listing) private listingRepo: Repository<Listing>,
    @InjectRepository(QAQuestion) private questionRepo: Repository<QAQuestion>,
    @InjectRepository(QAAnswer) private answerRepo: Repository<QAAnswer>,
    @InjectRepository(WallPost) private wallRepo: Repository<WallPost>,
    @InjectRepository(SharedResource) private resourceRepo: Repository<SharedResource>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Profile) private profileRepo: Repository<Profile>,
  ) {}

  async getFriends(userId: string) {
    const relations = await this.friendRepo.find({
      where: [
        { userAId: userId, statut: RelationStatus.ACCEPTE },
        { userBId: userId, statut: RelationStatus.ACCEPTE },
      ],
      relations: {
        userA: { profile: true },
        userB: { profile: true },
      },
    });

    return relations.map((rel) => {
      const friend = rel.userAId === userId ? rel.userB : rel.userA;
      return {
        id: rel.id,
        userAId: rel.userAId,
        userBId: rel.userBId,
        userA: rel.userA,
        userB: rel.userB,
        relationId: rel.id,
        type: rel.type,
        statut: rel.statut,
        friend,
      };
    });
  }

  async getFriendRequests(userId: string) {
    return this.friendRepo.find({
      where: { userBId: userId, statut: RelationStatus.EN_ATTENTE },
      relations: {
        userA: { profile: true },
      },
      order: { createdAt: 'DESC' },
    });
  }

  async getSuggestions(userId: string) {
    const currentUser = await this.userRepo.findOne({ where: { id: userId } });
    const existing = await this.friendRepo.find({
      where: [{ userAId: userId }, { userBId: userId }],
    });
    const excludedIds = new Set<string>([userId]);
    existing.forEach((r) => {
      excludedIds.add(r.userAId);
      excludedIds.add(r.userBId);
    });

    const qb = this.userRepo
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.profile', 'profile')
      .where('u.actif = :actif', { actif: true });

    if (currentUser?.filiere) {
      qb.andWhere('u.filiere = :filiere', { filiere: currentUser.filiere });
    }

    const candidates = await qb.take(20).getMany();
    return candidates.filter((u) => !excludedIds.has(u.id));
  }

  async sendFriendRequest(userAId: string, userBId: string) {
    let rel = await this.friendRepo.findOne({
      where: [
        { userAId, userBId },
        { userAId: userBId, userBId: userAId },
      ],
    });

    if (rel) {
      if (rel.statut === RelationStatus.REFUSE) {
        rel.statut = RelationStatus.EN_ATTENTE;
        rel.userAId = userAId;
        rel.userBId = userBId;
        return this.friendRepo.save(rel);
      }
      return rel;
    }

    const friendship = this.friendRepo.create({
      userAId,
      userBId,
      type: RelationType.AMI,
      statut: RelationStatus.EN_ATTENTE,
    });
    return this.friendRepo.save(friendship);
  }

  async updateFriendshipStatus(id: string, statut: RelationStatus) {
    const relation = await this.friendRepo.findOne({ where: { id } });
    if (!relation) throw new NotFoundException('Demande non trouvée');
    relation.statut = statut;
    return this.friendRepo.save(relation);
  }

  async getStories() {
    return this.storyRepo.find({
      relations: { auteur: true },
      order: { createdAt: 'DESC' },
    });
  }

  async createStory(auteurId: string, mediaUrl: string, type = 'IMAGE', audience = 'AMIS') {
    const story = this.storyRepo.create({
      auteurId,
      mediaUrl,
      type,
      audience,
      expiresAt: new Date(Date.now() + 24 * 3600 * 1000),
    });
    return this.storyRepo.save(story);
  }

  async getListings(category?: any) {
    const qb = this.listingRepo
      .createQueryBuilder('l')
      .leftJoinAndSelect('l.auteur', 'auteur')
      .where('l.statut = :statut', { statut: ListingStatus.ACTIF });

    if (category) {
      qb.andWhere('l.categorie = :category', { category });
    }

    return qb.orderBy('l.createdAt', 'DESC').getMany();
  }

  async createListing(auteurId: string, data: Partial<Listing>) {
    const listing = this.listingRepo.create({
      ...data,
      auteurId,
      statut: ListingStatus.ACTIF,
      expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000), // 30 jours
    });
    return this.listingRepo.save(listing);
  }

  async getQuestions(ueId?: string) {
    const qb = this.questionRepo
      .createQueryBuilder('q')
      .leftJoinAndSelect('q.auteur', 'auteur')
      .leftJoinAndSelect('q.ue', 'ue')
      .leftJoinAndSelect('q.reponses', 'reponses')
      .leftJoinAndSelect('reponses.auteur', 'ansAuteur');

    if (ueId) {
      qb.where('q.ueId = :ueId', { ueId });
    }

    return qb.orderBy('q.createdAt', 'DESC').getMany();
  }

  async createQuestion(auteurId: string, data: Partial<QAQuestion>) {
    const q = this.questionRepo.create({ ...data, auteurId });
    return this.questionRepo.save(q);
  }

  async answerQuestion(questionId: string, auteurId: string, contenu: string) {
    const ans = this.answerRepo.create({
      questionId,
      auteurId,
      contenu,
    });
    const saved = await this.answerRepo.save(ans);
    return this.answerRepo.findOne({
      where: { id: saved.id },
      relations: { auteur: true },
    });
  }

  async markSolution(questionId: string, answerId: string) {
    await this.answerRepo.update({ questionId }, { estSolution: false });
    await this.answerRepo.update(answerId, { estSolution: true });
    await this.questionRepo.update(questionId, { resolu: true });
    return { success: true };
  }

  async getWallPosts(userId?: string) {
    const qb = this.wallRepo
      .createQueryBuilder('w')
      .leftJoinAndSelect('w.auteur', 'auteur');

    if (userId) {
      qb.where('w.auteurId = :userId', { userId });
    }

    return qb.orderBy('w.createdAt', 'DESC').getMany();
  }

  async createWallPost(auteurId: string, contenu: string, mediaUrls?: string | string[], audience = PostAudience.AMIS) {
    const medias = Array.isArray(mediaUrls)
      ? mediaUrls
      : mediaUrls
      ? [mediaUrls]
      : [];

    const post = this.wallRepo.create({
      auteurId,
      contenu,
      medias,
      audience,
    });
    const saved = await this.wallRepo.save(post);
    return this.wallRepo.findOne({
      where: { id: saved.id },
      relations: { auteur: true },
    });
  }

  async deleteWallPost(id: string) {
    await this.wallRepo.delete(id);
    return { success: true };
  }

  async updateProfile(userId: string, data: any) {
    let profile = await this.profileRepo.findOne({ where: { userId } });
    if (!profile) {
      profile = new Profile();
      profile.userId = userId;
    }
    const cleanData = { ...data };
    if (cleanData.disponibilite) {
      const validStatuses = Object.values(AvailabilityStatus);
      if (!validStatuses.includes(cleanData.disponibilite)) {
        cleanData.disponibilite = AvailabilityStatus.DISPONIBLE_GROUPE;
      }
    }
    Object.assign(profile, cleanData);
    const savedProfile = await this.profileRepo.save(profile);
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: {
        profile: true,
        badges: true,
      },
    });
    return { profile: savedProfile, user };
  }
}
