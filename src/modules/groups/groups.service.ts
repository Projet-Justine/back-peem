import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group, GroupMember, Channel, User } from '../../entities';
import { GroupType, AdhesionMode, GroupMemberRole, ChannelType } from '../../common/enums';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group) private groupRepo: Repository<Group>,
    @InjectRepository(GroupMember) private memberRepo: Repository<GroupMember>,
    @InjectRepository(Channel) private channelRepo: Repository<Channel>,
  ) {}

  async findAll(userId?: string) {
    const qb = this.groupRepo
      .createQueryBuilder('g')
      .leftJoinAndSelect('g.proprietaire', 'proprietaire')
      .leftJoinAndSelect('g.members', 'members')
      .leftJoinAndSelect('members.user', 'memberUser')
      .leftJoinAndSelect('g.channels', 'channels');

    if (userId) {
      qb.where('members.userId = :userId', { userId });
    }

    return qb.orderBy('g.createdAt', 'DESC').getMany();
  }

  async findOne(id: string) {
    const group = await this.groupRepo.findOne({
      where: { id },
      relations: {
        proprietaire: true,
        members: { user: true },
        channels: true,
        folders: true,
        meetings: true,
        assignments: true,
      },
    });
    if (!group) throw new NotFoundException('Groupe non trouvé');
    return group;
  }

  async create(data: Partial<Group>, userId: string) {
    const group = this.groupRepo.create({
      ...data,
      proprietaireId: userId,
      codeInvitation: Math.random().toString(36).substring(2, 8).toUpperCase(),
    });
    const savedGroup = await this.groupRepo.save(group);

    // Ajouter le créateur comme propriétaire
    await this.memberRepo.save(
      this.memberRepo.create({
        groupeId: savedGroup.id,
        userId,
        role: GroupMemberRole.PROPRIETAIRE,
        statut: 'ACTIF',
      }),
    );

    // Créer automatiquement les canaux par défaut (Général, Annonces)
    await this.channelRepo.save([
      this.channelRepo.create({
        nom: 'Général',
        groupeId: savedGroup.id,
        type: ChannelType.GROUPE,
      }),
      this.channelRepo.create({
        nom: 'Annonces',
        groupeId: savedGroup.id,
        type: ChannelType.ANNONCES,
      }),
    ]);

    return this.findOne(savedGroup.id);
  }

  async joinGroup(groupId: string, userId: string) {
    const group = await this.groupRepo.findOne({ where: { id: groupId } });
    if (!group) throw new NotFoundException('Groupe non trouvé');

    const existing = await this.memberRepo.findOne({
      where: { groupeId: groupId, userId },
    });
    if (existing) return existing;

    const newMember = this.memberRepo.create({
      groupeId: groupId,
      userId,
      role: GroupMemberRole.MEMBRE,
      statut: 'ACTIF',
    });
    return this.memberRepo.save(newMember);
  }

  async joinByCode(code: string, userId: string) {
    const group = await this.groupRepo.findOne({ where: { codeInvitation: code } });
    if (!group) throw new NotFoundException('Code d invitation invalide');

    const existing = await this.memberRepo.findOne({
      where: { groupeId: group.id, userId },
    });
    if (existing) return existing;

    const newMember = this.memberRepo.create({
      groupeId: group.id,
      userId,
      role: GroupMemberRole.MEMBRE,
      statut: 'ACTIF',
    });
    return this.memberRepo.save(newMember);
  }
}
