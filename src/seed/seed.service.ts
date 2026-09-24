import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  User,
  Profile,
  Badge,
  Group,
  GroupMember,
  Channel,
  Message,
  VoiceMessage,
  UE,
  MatiereEC,
  Enrollment,
  Evaluation,
  Grade,
  ResultatUE,
  Post,
  PostTarget,
  PostComment,
  PostLike,
  Meeting,
  Listing,
  QAQuestion,
  QAAnswer,
  SocialPage,
  SocialEvent,
  Story,
  Folder,
  FileItem,
  Friendship,
} from '../entities';
import {
  UserRole,
  GroupType,
  AdhesionMode,
  GroupMemberRole,
  ChannelType,
  MessageType,
  UEStatus,
  EvaluationType,
  PresenceStatus,
  GradePublicationStatus,
  DecisionUE,
  PostType,
  PostStatus,
  MeetingStatus,
  ListingCategory,
  ListingStatus,
  RelationType,
  RelationStatus,
} from '../common/enums';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Profile) private profileRepo: Repository<Profile>,
    @InjectRepository(Badge) private badgeRepo: Repository<Badge>,
    @InjectRepository(Group) private groupRepo: Repository<Group>,
    @InjectRepository(GroupMember) private groupMemberRepo: Repository<GroupMember>,
    @InjectRepository(Channel) private channelRepo: Repository<Channel>,
    @InjectRepository(Message) private messageRepo: Repository<Message>,
    @InjectRepository(VoiceMessage) private voiceRepo: Repository<VoiceMessage>,
    @InjectRepository(UE) private ueRepo: Repository<UE>,
    @InjectRepository(MatiereEC) private ecRepo: Repository<MatiereEC>,
    @InjectRepository(Enrollment) private enrollRepo: Repository<Enrollment>,
    @InjectRepository(Evaluation) private evalRepo: Repository<Evaluation>,
    @InjectRepository(Grade) private gradeRepo: Repository<Grade>,
    @InjectRepository(ResultatUE) private resUeRepo: Repository<ResultatUE>,
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(PostTarget) private postTargetRepo: Repository<PostTarget>,
    @InjectRepository(PostComment) private postCommentRepo: Repository<PostComment>,
    @InjectRepository(PostLike) private postLikeRepo: Repository<PostLike>,
    @InjectRepository(Meeting) private meetingRepo: Repository<Meeting>,
    @InjectRepository(Listing) private listingRepo: Repository<Listing>,
    @InjectRepository(QAQuestion) private qaQRepo: Repository<QAQuestion>,
    @InjectRepository(QAAnswer) private qaARepo: Repository<QAAnswer>,
    @InjectRepository(SocialPage) private pageRepo: Repository<SocialPage>,
    @InjectRepository(SocialEvent) private eventRepo: Repository<SocialEvent>,
    @InjectRepository(Story) private storyRepo: Repository<Story>,
    @InjectRepository(Folder) private folderRepo: Repository<Folder>,
    @InjectRepository(FileItem) private fileRepo: Repository<FileItem>,
    @InjectRepository(Friendship) private friendRepo: Repository<Friendship>,
  ) {}

  async onApplicationBootstrap() {
    const userCount = await this.userRepo.count();
    if (userCount > 0) {
      console.log(`[SeedService] Database already populated with ${userCount} users.`);
      return;
    }

    console.log('[SeedService] Populating initial EMIT platform data...');
    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('emit2026', salt);

    // 1. Users & Profiles
    const admin = await this.userRepo.save(
      this.userRepo.create({
        nom: 'RAZAFY',
        prenom: 'Andry',
        email: 'admin@emit.mg',
        matricule: 'ADM-001',
        motDePasse: defaultPassword,
        role: UserRole.ADMIN,
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      }),
    );
    await this.profileRepo.save(
      this.profileRepo.create({
        userId: admin.id,
        bio: 'Administrateur principal du système d information EMIT.',
        competences: ['Administration Système', 'Sécurité', 'Gouvernance IT'],
      }),
    );

    const scolarite = await this.userRepo.save(
      this.userRepo.create({
        nom: 'RAMANANTOANINA',
        prenom: 'Fanja',
        email: 'scolarite@emit.mg',
        matricule: 'SCO-002',
        motDePasse: defaultPassword,
        role: UserRole.SCOLARITE,
        photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      }),
    );
    await this.profileRepo.save(
      this.profileRepo.create({
        userId: scolarite.id,
        bio: 'Service Scolarité et Gestion des Examens EMIT.',
      }),
    );

    const respFiliere = await this.userRepo.save(
      this.userRepo.create({
        nom: 'RABENANTOANDRO',
        prenom: 'Harisoa',
        email: 'resp.info@emit.mg',
        matricule: 'ENS-010',
        motDePasse: defaultPassword,
        role: UserRole.RESPONSABLE_FILIERE,
        filiere: 'Informatique',
        photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
      }),
    );

    const profRakoto = await this.userRepo.save(
      this.userRepo.create({
        nom: 'RAKOTO',
        prenom: 'Jean-Marc',
        email: 'prof.rakoto@emit.mg',
        matricule: 'ENS-021',
        motDePasse: defaultPassword,
        role: UserRole.ENSEIGNANT,
        filiere: 'Informatique',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      }),
    );
    await this.profileRepo.save(
      this.profileRepo.create({
        userId: profRakoto.id,
        bio: 'Enseignant-Chercheur en Bases de Données & Systèmes Distribués à l EMIT.',
        competences: ['PostgreSQL', 'Algorithmes', 'Systèmes Temps Réel'],
      }),
    );

    const etudiantJean = await this.userRepo.save(
      this.userRepo.create({
        nom: 'ANDRIANIRINA',
        prenom: 'Jean',
        email: 'etudiant.jean@emit.mg',
        matricule: '24-EMIT-INF-042',
        motDePasse: defaultPassword,
        role: UserRole.ETUDIANT,
        filiere: 'Informatique',
        niveau: 'L2',
        promotion: '2026',
        photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      }),
    );
    await this.profileRepo.save(
      this.profileRepo.create({
        userId: etudiantJean.id,
        bio: 'Passionné de développement web fullstack TypeScript et d intelligence artificielle.',
        competences: ['React', 'NestJS', 'PostgreSQL', 'TypeScript', 'Tailwind'],
        githubUrl: 'https://github.com',
      }),
    );
    await this.badgeRepo.save(
      this.badgeRepo.create({
        userId: etudiantJean.id,
        nom: 'Contributeur',
        description: 'A partagé 5 résumés validés de cours',
      }),
    );

    const etudiantMarie = await this.userRepo.save(
      this.userRepo.create({
        nom: 'RAZANAMPARANY',
        prenom: 'Marie',
        email: 'etudiant.marie@emit.mg',
        matricule: '24-EMIT-INF-088',
        motDePasse: defaultPassword,
        role: UserRole.DELEGUE,
        filiere: 'Informatique',
        niveau: 'L2',
        promotion: '2026',
        photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      }),
    );
    await this.badgeRepo.save(
      this.badgeRepo.create({
        userId: etudiantMarie.id,
        nom: 'Délégué',
        description: 'Déléguée de promotion L2 Informatique',
      }),
    );

    // Friendships
    await this.friendRepo.save(
      this.friendRepo.create({
        userAId: etudiantJean.id,
        userBId: etudiantMarie.id,
        type: RelationType.AMI,
        statut: RelationStatus.ACCEPTE,
      }),
    );

    // 2. Academic Curriculum (UEs & ECs)
    const ueBdd = await this.ueRepo.save(
      this.ueRepo.create({
        code: 'INF202',
        intitule: 'Conception et Administration des Bases de Données',
        creditsEcts: 5,
        coefficient: 3,
        volumeHoraireCm: 25,
        volumeHoraireTd: 15,
        volumeHoraireTp: 20,
        semestre: 'S3',
        filiere: 'Informatique',
        niveau: 'L2',
        statut: UEStatus.PUBLIEE,
        programme: 'Modélisation relationnelle, SQL avancé, PostgreSQL, Indexation, Transactions ACID, NoSQL.',
        objectifs: 'Maîtriser la modélisation et l optimisation des bases de données relationnelles.',
        responsableId: profRakoto.id,
      }),
    );

    const ueAlgo = await this.ueRepo.save(
      this.ueRepo.create({
        code: 'INF201',
        intitule: 'Algorithmique Avancée et Structures de Données',
        creditsEcts: 5,
        coefficient: 3,
        volumeHoraireCm: 30,
        volumeHoraireTd: 20,
        volumeHoraireTp: 10,
        semestre: 'S3',
        filiere: 'Informatique',
        niveau: 'L2',
        statut: UEStatus.PUBLIEE,
        programme: 'Arbres, Graphes, Complexité algorithmique, Programmation dynamique.',
        responsableId: profRakoto.id,
      }),
    );

    const ecPostgres = await this.ecRepo.save(
      this.ecRepo.create({
        ueId: ueBdd.id,
        intitule: 'PostgreSQL & Optimisation',
        coefficient: 2,
        volumeHoraire: 30,
        enseignantId: profRakoto.id,
      }),
    );

    // Enrollments
    await this.enrollRepo.save(
      this.enrollRepo.create({
        etudiantId: etudiantJean.id,
        ueId: ueBdd.id,
        anneeUniversitaire: '2025-2026',
        statut: 'INSCRIT',
      }),
    );
    await this.enrollRepo.save(
      this.enrollRepo.create({
        etudiantId: etudiantMarie.id,
        ueId: ueBdd.id,
        anneeUniversitaire: '2025-2026',
        statut: 'INSCRIT',
      }),
    );

    // 3. Evaluations & Grades
    const evalExamen = await this.evalRepo.save(
      this.evalRepo.create({
        titre: 'Examen Final - Conception BDD & SQL',
        ueId: ueBdd.id,
        matiereEcId: ecPostgres.id,
        type: EvaluationType.EXAMEN,
        ponderation: 1.5,
        dateEvaluation: new Date(),
        session: 'NORMALE',
      }),
    );

    const evalTp = await this.evalRepo.save(
      this.evalRepo.create({
        titre: 'Contrôle Continu / TP TypeORM & PostgreSQL',
        ueId: ueBdd.id,
        matiereEcId: ecPostgres.id,
        type: EvaluationType.TP,
        ponderation: 1.0,
        dateEvaluation: new Date(),
        session: 'NORMALE',
      }),
    );

    // Grades for Jean
    await this.gradeRepo.save(
      this.gradeRepo.create({
        evaluationId: evalExamen.id,
        etudiantId: etudiantJean.id,
        valeur: 16.5,
        statutPresence: PresenceStatus.PRESENT,
        statutPublication: GradePublicationStatus.PUBLIE,
        saisieParId: profRakoto.id,
      }),
    );

    await this.gradeRepo.save(
      this.gradeRepo.create({
        evaluationId: evalTp.id,
        etudiantId: etudiantJean.id,
        valeur: 17.0,
        statutPresence: PresenceStatus.PRESENT,
        statutPublication: GradePublicationStatus.PUBLIE,
        saisieParId: profRakoto.id,
      }),
    );

    // Grades for Marie
    await this.gradeRepo.save(
      this.gradeRepo.create({
        evaluationId: evalExamen.id,
        etudiantId: etudiantMarie.id,
        valeur: 15.0,
        statutPresence: PresenceStatus.PRESENT,
        statutPublication: GradePublicationStatus.PUBLIE,
        saisieParId: profRakoto.id,
      }),
    );

    // Compute Resultat UE
    await this.resUeRepo.save(
      this.resUeRepo.create({
        etudiantId: etudiantJean.id,
        ueId: ueBdd.id,
        moyenne: 16.7,
        creditsObtenus: 5,
        decision: DecisionUE.ADMIS,
        session: 'NORMALE',
      }),
    );

    // 4. Groups & Classes
    const classGroup = await this.groupRepo.save(
      this.groupRepo.create({
        nom: 'L2 Informatique 2026',
        description: 'Classe officielle de promotion Licence 2 Mention Informatique EMIT.',
        type: GroupType.CLASSE_OFFICIELLE,
        modeAdhesion: AdhesionMode.INVITATION,
        filiere: 'Informatique',
        niveau: 'L2',
        proprietaireId: admin.id,
        quotaStockageMo: 2000,
      }),
    );

    const clubGroup = await this.groupRepo.save(
      this.groupRepo.create({
        nom: 'Club Robotique & IA EMIT',
        description: 'Recherche, projets matériels, IoT, vision par ordinateur et robotique.',
        type: GroupType.CLUB,
        modeAdhesion: AdhesionMode.OUVERT,
        proprietaireId: etudiantMarie.id,
        quotaStockageMo: 1000,
      }),
    );

    // Group memberships
    await this.groupMemberRepo.save([
      this.groupMemberRepo.create({
        groupeId: classGroup.id,
        userId: etudiantJean.id,
        role: GroupMemberRole.MEMBRE,
      }),
      this.groupMemberRepo.create({
        groupeId: classGroup.id,
        userId: etudiantMarie.id,
        role: GroupMemberRole.MODERATEUR,
      }),
      this.groupMemberRepo.create({
        groupeId: classGroup.id,
        userId: profRakoto.id,
        role: GroupMemberRole.MEMBRE,
      }),
    ]);

    // 5. Channels & Messages
    const generalChannel = await this.channelRepo.save(
      this.channelRepo.create({
        nom: 'Général',
        groupeId: classGroup.id,
        type: ChannelType.GROUPE,
        description: 'Discussions générales de la promotion L2',
      }),
    );

    const announcementChannel = await this.channelRepo.save(
      this.channelRepo.create({
        nom: 'Annonces-Officielles',
        groupeId: classGroup.id,
        type: ChannelType.ANNONCES,
        description: 'Annonces des enseignants et des délégués',
      }),
    );

    // Sample Chat messages
    const welcomeMsg = await this.messageRepo.save(
      this.messageRepo.create({
        channelId: generalChannel.id,
        auteurId: profRakoto.id,
        type: MessageType.TEXTE,
        contenu: 'Bonjour à tous ! Les supports du TP TypeORM sont disponibles dans l espace fichiers.',
        epingle: true,
      }),
    );

    const msgVoice = await this.messageRepo.save(
      this.messageRepo.create({
        channelId: generalChannel.id,
        auteurId: etudiantMarie.id,
        type: MessageType.VOCAL,
        contenu: 'Note vocale explicative sur le projet de rentrée (1min12)',
      }),
    );

    await this.voiceRepo.save(
      this.voiceRepo.create({
        messageId: msgVoice.id,
        fichierAudioUrl: '/audio/sample-voice-emit.mp3',
        dureeSecondes: 72,
        tailleOctets: 48000,
        formeOnde: JSON.stringify([2, 5, 8, 14, 22, 35, 20, 18, 28, 40, 30, 15, 8, 4]),
        transcription: 'Rappel pour tous les camarades de L2, la remise du compte rendu TP est prévue ce vendredi avant 23h59.',
      }),
    );

    // 6. Fil d'actualité officiel (Posts)
    const postOfficial = await this.postRepo.save(
      this.postRepo.create({
        auteurId: admin.id,
        titre: 'Ouverture officielle de la plateforme collaborative EMIT',
        type: PostType.ANNONCE,
        contenu: 'Bienvenue sur la plateforme collaborative en ligne de l École de Management et d Innovation Technologique (EMIT). Retrouvez vos cours, chat en temps réel, messages vocaux, groupes d études et consultation des notes.',
        epingle: true,
        commentairesActifs: true,
        statut: PostStatus.PUBLIE,
        datePublication: new Date(),
        vuesCount: 142,
      }),
    );

    await this.postTargetRepo.save(
      this.postTargetRepo.create({
        postId: postOfficial.id,
      }),
    );

    await this.postCommentRepo.save(
      this.postCommentRepo.create({
        postId: postOfficial.id,
        auteurId: etudiantJean.id,
        contenu: 'Excellente initiative ! L interface est très rapide et intuitive.',
      }),
    );

    await this.postLikeRepo.save(
      this.postLikeRepo.create({
        postId: postOfficial.id,
        userId: etudiantJean.id,
        type: 'LIKE',
      }),
    );

    // 7. Video Meetings
    await this.meetingRepo.save(
      this.meetingRepo.create({
        titre: 'Séance de Révision Bases de Données & Architecture TypeORM',
        hoteId: profRakoto.id,
        groupeId: classGroup.id,
        salleCode: 'EMIT-L2-BDD-MEET',
        statut: MeetingStatus.PROGRAMMEE,
        dateDebut: new Date(Date.now() + 3600 * 1000 * 2), // in 2 hours
        lien: 'https://meet.emit.mg/EMIT-L2-BDD-MEET',
        estEnregistree: true,
      }),
    );

    // 8. Petites Annonces (Marketplace)
    await this.listingRepo.save([
      this.listingRepo.create({
        auteurId: etudiantMarie.id,
        titre: 'Livre Conception de Bases de Données Relationnelles - 4e édition',
        description: 'Très bon état, idéal pour les révisions de L2 et L3 Informatique. Remise en main propre sur le campus EMIT.',
        categorie: ListingCategory.LIVRES,
        prix: 25000,
        contactInfo: 'Contacter sur le chat ou par MP',
        statut: ListingStatus.ACTIF,
      }),
      this.listingRepo.create({
        auteurId: etudiantJean.id,
        titre: 'Calculatrice Casio Graph 35+ pour Examens',
        description: 'Fonctionne parfaitement avec piles neuves. Pratique pour les matières de gestion et statistiques.',
        categorie: ListingCategory.MATERIEL,
        prix: 35000,
        statut: ListingStatus.ACTIF,
      }),
    ]);

    // 9. Entraide académique (Q&A par UE)
    const question1 = await this.qaQRepo.save(
      this.qaQRepo.create({
        auteurId: etudiantJean.id,
        ueId: ueBdd.id,
        titre: 'Différence entre isolation READ COMMITTED et REPEATABLE READ dans PostgreSQL ?',
        contenu: 'Bonjour, dans le cadre du cours sur les transactions ACID, je ne saisis pas bien la nuance exacte lors de lectures répétées concurrentes. Quelqu un peut m éclairer ?',
        resolu: true,
      }),
    );

    const answer1 = await this.qaARepo.save(
      this.qaARepo.create({
        questionId: question1.id,
        auteurId: profRakoto.id,
        contenu: 'En READ COMMITTED, chaque requête d une transaction voit les commits effectués avant son démarrage. En REPEATABLE READ, la transaction voit un instantané (snapshot) figé au moment de sa toute première requête d exécution.',
        estSolution: true,
        votes: 12,
      }),
    );
    question1.solutionAnswerId = answer1.id;
    await this.qaQRepo.save(question1);

    // 10. Stories
    await this.storyRepo.save(
      this.storyRepo.create({
        auteurId: etudiantMarie.id,
        mediaUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600',
        type: 'IMAGE',
        audience: 'AMIS',
        expiresAt: new Date(Date.now() + 24 * 3600 * 1000),
      }),
    );

    // 11. Espace Fichiers
    const folderCours = await this.folderRepo.save(
      this.folderRepo.create({
        nom: 'Supports de Cours - S3',
        groupeId: classGroup.id,
        proprietaireId: profRakoto.id,
      }),
    );

    await this.fileRepo.save([
      this.fileRepo.create({
        nom: 'Syllabus-INF202-Bases-de-Donnees.pdf',
        folder: folderCours,
        dossierId: folderCours.id,
        groupeId: classGroup.id,
        tailleOctets: 1024 * 350,
        typeMime: 'application/pdf',
        proprietaireId: profRakoto.id,
        version: 1,
      }),
      this.fileRepo.create({
        nom: 'TP1-TypeORM-Migrations-PostgreSQL.pdf',
        folder: folderCours,
        dossierId: folderCours.id,
        groupeId: classGroup.id,
        tailleOctets: 1024 * 512,
        typeMime: 'application/pdf',
        proprietaireId: profRakoto.id,
        version: 1,
      }),
    ]);

    console.log('[SeedService] Initial EMIT database seeding completed successfully!');
  }
}
