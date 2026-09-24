import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Evaluation,
  Grade,
  GradeHistory,
  Claim,
  ResultatUE,
  UE,
  User,
} from '../../entities';
import {
  GradePublicationStatus,
  ClaimStatus,
  PresenceStatus,
  DecisionUE,
  UserRole,
} from '../../common/enums';

@Injectable()
export class GradesService {
  constructor(
    @InjectRepository(Evaluation) private evalRepo: Repository<Evaluation>,
    @InjectRepository(Grade) private gradeRepo: Repository<Grade>,
    @InjectRepository(GradeHistory) private historyRepo: Repository<GradeHistory>,
    @InjectRepository(Claim) private claimRepo: Repository<Claim>,
    @InjectRepository(ResultatUE) private resultatRepo: Repository<ResultatUE>,
    @InjectRepository(UE) private ueRepo: Repository<UE>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async getEvaluations(filters: { ueId?: string; enseignantId?: string }) {
    const qb = this.evalRepo
      .createQueryBuilder('ev')
      .leftJoinAndSelect('ev.ue', 'ue')
      .leftJoinAndSelect('ev.matiereEc', 'ec')
      .leftJoinAndSelect('ev.grades', 'grades');

    if (filters.ueId) {
      qb.where('ev.ueId = :ueId', { ueId: filters.ueId });
    }
    if (filters.enseignantId) {
      qb.andWhere('ev.enseignantId = :enseignantId', {
        enseignantId: filters.enseignantId,
      });
    }

    return qb.orderBy('ev.dateEvaluation', 'DESC').getMany();
  }

  async createEvaluation(data: Partial<Evaluation>) {
    const ev = this.evalRepo.create(data);
    return this.evalRepo.save(ev);
  }

  async getGradesByEvaluation(evaluationId: string) {
    return this.gradeRepo.find({
      where: { evaluationId },
      relations: {
        etudiant: true,
        saisiePar: true,
        historique: true,
        reclamations: true,
      },
      order: { etudiant: { nom: 'ASC' } },
    });
  }

  async batchSaveGrades(
    evaluationId: string,
    gradesInput: Array<{
      etudiantId: string;
      valeur?: number;
      statutPresence?: PresenceStatus;
    }>,
    saisieParId: string,
    statutPublication: GradePublicationStatus = GradePublicationStatus.BROUILLON,
  ) {
    const results: Grade[] = [];

    for (const item of gradesInput) {
      let grade = await this.gradeRepo.findOne({
        where: { evaluationId, etudiantId: item.etudiantId },
      });

      if (grade) {
        // Enregistrer l'historique
        await this.historyRepo.save(
          this.historyRepo.create({
            noteId: grade.id,
            ancienneValeur: grade.valeur,
            nouvelleValeur: item.valeur,
            modifieParId: saisieParId,
            motif: 'Mise à jour par lot des notes',
          }),
        );

        grade.valeur = item.valeur ?? grade.valeur;
        grade.statutPresence = item.statutPresence || PresenceStatus.PRESENT;
        grade.statutPublication = statutPublication;
      } else {
        grade = this.gradeRepo.create({
          evaluationId,
          etudiantId: item.etudiantId,
          valeur: item.valeur,
          statutPresence: item.statutPresence || PresenceStatus.PRESENT,
          statutPublication,
          saisieParId,
        });
      }

      results.push(await this.gradeRepo.save(grade));
    }

    return results;
  }

  async saveBatchGradesDirect(data: {
    evaluationId: string;
    grades: Array<{ etudiantId: string; valeur?: number; statutPresence?: string }>;
    saisieParId: string;
    statut?: GradePublicationStatus;
  }) {
    return this.batchSaveGrades(
      data.evaluationId,
      data.grades.map((g) => ({
        etudiantId: g.etudiantId,
        valeur: g.valeur,
        statutPresence: (g.statutPresence as PresenceStatus) || PresenceStatus.PRESENT,
      })),
      data.saisieParId,
      data.statut || GradePublicationStatus.BROUILLON,
    );
  }

  async updateGradeWorkflow(gradeId: string, action: string, userId?: string) {
    const grade = await this.gradeRepo.findOne({
      where: { id: gradeId },
      relations: { evaluation: true },
    });
    if (!grade) throw new NotFoundException('Note non trouvée');

    let newStatus = GradePublicationStatus.BROUILLON;
    if (action === 'valider') newStatus = GradePublicationStatus.VALIDE;
    else if (action === 'publier') newStatus = GradePublicationStatus.PUBLIE;
    else if (action === 'verrouiller') newStatus = GradePublicationStatus.VERROUILLE;
    else if (action === 'rejeter') newStatus = GradePublicationStatus.BROUILLON;

    grade.statutPublication = newStatus;
    const res = await this.gradeRepo.save(grade);

    if (newStatus === GradePublicationStatus.PUBLIE && grade.evaluation?.ueId) {
      await this.recalculateStudentUE(grade.etudiantId, grade.evaluation.ueId);
    }

    return res;
  }

  async updateEvaluationStatus(
    evaluationId: string,
    status: GradePublicationStatus,
  ) {
    await this.gradeRepo.update(
      { evaluationId },
      { statutPublication: status },
    );
    return { message: `Statut mis à jour: ${status}` };
  }

  async getAllGradesAdmin() {
    return this.gradeRepo.find({
      relations: {
        evaluation: { ue: true, matiereEc: true },
        etudiant: true,
        saisiePar: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async getMyResults(userId: string) {
    let student = await this.userRepo.findOne({ where: { id: userId } });
    if (!student) {
      student = await this.userRepo.findOne({ where: { role: UserRole.ETUDIANT } });
    }
    if (!student) return [];

    const effectiveUserId = student.id;

    // Trouver les UEs pertinentes
    const ues = await this.ueRepo.find({
      where: [
        { filiere: student.filiere, niveau: student.niveau },
        { filiere: student.filiere },
      ],
      relations: {
        evaluations: { matiereEc: true },
      },
    });

    const studentGrades = await this.gradeRepo.find({
      where: { etudiantId: effectiveUserId },
      relations: { evaluation: true },
    });

    const resultatsUE = await this.resultatRepo.find({
      where: { etudiantId: effectiveUserId },
    });

    return ues.map((ue) => {
      const evals = (ue.evaluations || []).map((ev) => {
        const grade = studentGrades.find((g) => g.evaluationId === ev.id) || null;
        return { evaluation: ev, grade };
      });

      const resUE = resultatsUE.find((r) => r.ueId === ue.id);
      return {
        ue,
        evaluations: evals,
        moyenne: resUE ? Number(resUE.moyenne) : undefined,
        resultat: resUE || null,
      };
    });
  }

  async recalculateStudentUE(etudiantId: string, ueId: string) {
    const ue = await this.ueRepo.findOne({
      where: { id: ueId },
      relations: {
        evaluations: { grades: true },
      },
    });
    if (!ue) return null;

    let totalPoints = 0;
    let totalPonderation = 0;

    for (const ev of ue.evaluations || []) {
      const g = ev.grades?.find((gr) => gr.etudiantId === etudiantId);
      if (g && g.valeur !== null && g.statutPresence === PresenceStatus.PRESENT) {
        totalPoints += Number(g.valeur) * Number(ev.ponderation);
        totalPonderation += Number(ev.ponderation);
      }
    }

    const moyenne = totalPonderation > 0 ? Number((totalPoints / totalPonderation).toFixed(2)) : 0;
    const isAdmis = moyenne >= 10;
    const decision = isAdmis ? DecisionUE.ADMIS : DecisionUE.AJOURNE;
    const credits = isAdmis ? ue.creditsEcts : 0;

    let resultat = await this.resultatRepo.findOne({
      where: { etudiantId, ueId },
    });

    if (resultat) {
      resultat.moyenne = moyenne;
      resultat.creditsObtenus = credits;
      resultat.decision = decision;
      return this.resultatRepo.save(resultat);
    } else {
      resultat = this.resultatRepo.create({
        etudiantId,
        ueId,
        moyenne,
        creditsObtenus: credits,
        decision,
        session: 'NORMALE',
      });
      return this.resultatRepo.save(resultat);
    }
  }

  async getStudentTranscript(etudiantId: string) {
    let student = await this.userRepo.findOne({ where: { id: etudiantId } });
    if (!student) {
      student = await this.userRepo.findOne({ where: { role: UserRole.ETUDIANT } });
    }
    if (!student) throw new NotFoundException('Étudiant non trouvé');

    const grades = await this.gradeRepo.find({
      where: { etudiantId: student.id, statutPublication: GradePublicationStatus.PUBLIE },
      relations: {
        evaluation: { ue: true, matiereEc: true },
      },
    });

    const resultatsUE = await this.resultatRepo.find({
      where: { etudiantId: student.id },
      relations: { ue: true },
    });

    let totalCredits = 0;
    let sumMoyennes = 0;

    resultatsUE.forEach((r) => {
      totalCredits += r.creditsObtenus;
      sumMoyennes += Number(r.moyenne);
    });

    const moyenneGenerale = resultatsUE.length > 0 ? Number((sumMoyennes / resultatsUE.length).toFixed(2)) : 0;

    return {
      etudiant: {
        id: student.id,
        nom: student.nom,
        prenom: student.prenom,
        matricule: student.matricule,
        filiere: student.filiere,
        niveau: student.niveau,
        promotion: student.promotion,
      },
      semestre: 'Semestre 3 (2025-2026)',
      moyenneGenerale,
      totalCreditsEcts: totalCredits,
      decisionGlobale: moyenneGenerale >= 10 ? 'ADMIS' : 'AJOURNÉ',
      resultatsUE,
      grades,
    };
  }

  async submitClaim(noteId: string, etudiantId: string, motif: string) {
    const claim = this.claimRepo.create({
      noteId,
      etudiantId,
      motif,
      statut: ClaimStatus.DEPOSEE,
    });
    return this.claimRepo.save(claim);
  }

  async updateClaim(
    claimId: string,
    statut: ClaimStatus,
    reponse: string,
    traiteParId: string,
  ) {
    const claim = await this.claimRepo.findOne({ where: { id: claimId } });
    if (!claim) throw new NotFoundException('Réclamation non trouvée');
    claim.statut = statut;
    claim.reponse = reponse;
    claim.traiteParId = traiteParId;
    return this.claimRepo.save(claim);
  }

  async getAllClaims() {
    return this.claimRepo.find({
      relations: {
        etudiant: true,
        grade: {
          evaluation: { ue: true },
        },
      },
      order: { createdAt: 'DESC' },
    });
  }
}
