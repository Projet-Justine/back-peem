import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meeting, Participation, Recording, User } from '../../entities';
import { MeetingStatus } from '../../common/enums';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectRepository(Meeting) private meetingRepo: Repository<Meeting>,
    @InjectRepository(Participation) private partRepo: Repository<Participation>,
    @InjectRepository(Recording) private recRepo: Repository<Recording>,
  ) {}

  async findAll(groupeId?: string) {
    const qb = this.meetingRepo
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.hote', 'hote')
      .leftJoinAndSelect('m.group', 'group')
      .leftJoinAndSelect('m.participations', 'participations')
      .leftJoinAndSelect('participations.user', 'partUser')
      .leftJoinAndSelect('m.recordings', 'recordings');

    if (groupeId) {
      qb.where('m.groupeId = :groupeId', { groupeId });
    }

    return qb.orderBy('m.dateDebut', 'DESC').getMany();
  }

  async findOne(id: string) {
    return this.meetingRepo.findOne({
      where: { id },
      relations: {
        hote: true,
        group: true,
        participations: { user: true },
        recordings: true,
      },
    });
  }

  async create(data: Partial<Meeting>, hoteId: string) {
    const salleCode = 'EMIT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const meeting = this.meetingRepo.create({
      ...data,
      hoteId,
      salleCode,
      lien: `https://meet.emit.mg/${salleCode}`,
      statut: MeetingStatus.PROGRAMMEE,
    });
    return this.meetingRepo.save(meeting);
  }

  async join(meetingId: string, userId: string) {
    const part = this.partRepo.create({
      meetingId,
      userId,
      arrivee: new Date(),
    });
    return this.partRepo.save(part);
  }
}
