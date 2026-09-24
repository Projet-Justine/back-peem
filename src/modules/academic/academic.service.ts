import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UE, MatiereEC, Enrollment, User } from '../../entities';
import { UEStatus } from '../../common/enums';

@Injectable()
export class AcademicService {
  constructor(
    @InjectRepository(UE) private ueRepo: Repository<UE>,
    @InjectRepository(MatiereEC) private ecRepo: Repository<MatiereEC>,
    @InjectRepository(Enrollment) private enrollRepo: Repository<Enrollment>,
  ) {}

  async findAllUE(filters?: { filiere?: string; niveau?: string; semestre?: string }) {
    const qb = this.ueRepo
      .createQueryBuilder('ue')
      .leftJoinAndSelect('ue.responsable', 'responsable')
      .leftJoinAndSelect('ue.elementsConstitutifs', 'ec')
      .leftJoinAndSelect('ec.enseignant', 'enseignant');

    if (filters?.filiere) {
      qb.andWhere('ue.filiere = :filiere', { filiere: filters.filiere });
    }
    if (filters?.niveau) {
      qb.andWhere('ue.niveau = :niveau', { niveau: filters.niveau });
    }
    if (filters?.semestre) {
      qb.andWhere('ue.semestre = :semestre', { semestre: filters.semestre });
    }

    return qb.orderBy('ue.code', 'ASC').getMany();
  }

  async findOneUE(id: string) {
    const ue = await this.ueRepo.findOne({
      where: { id },
      relations: {
        responsable: true,
        elementsConstitutifs: { enseignant: true },
        evaluations: true,
        inscriptions: { etudiant: true },
      },
    });
    if (!ue) {
      throw new NotFoundException(`UE non trouvée`);
    }
    return ue;
  }

  async createUE(data: Partial<UE>) {
    const ue = this.ueRepo.create(data);
    return this.ueRepo.save(ue);
  }

  async updateUE(id: string, data: Partial<UE>) {
    await this.ueRepo.update(id, data);
    return this.findOneUE(id);
  }

  async enrollStudent(etudiantId: string, ueId: string, anneeUniversitaire = '2025-2026') {
    const existing = await this.enrollRepo.findOne({ where: { etudiantId, ueId } });
    if (existing) return existing;
    const enroll = this.enrollRepo.create({
      etudiantId,
      ueId,
      anneeUniversitaire,
      statut: 'INSCRIT',
    });
    return this.enrollRepo.save(enroll);
  }

  async getStudentEnrollments(etudiantId: string) {
    return this.enrollRepo.find({
      where: { etudiantId },
      relations: {
        ue: {
          responsable: true,
          elementsConstitutifs: true,
        },
      },
    });
  }
}
