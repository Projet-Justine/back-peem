export enum UserRole {
  ADMIN = 'ADMIN',
  SCOLARITE = 'SCOLARITE',
  RESPONSABLE_FILIERE = 'RESPONSABLE_FILIERE',
  ENSEIGNANT = 'ENSEIGNANT',
  ETUDIANT = 'ETUDIANT',
  DELEGUE = 'DELEGUE',
}

export enum GroupType {
  CLASSE_OFFICIELLE = 'CLASSE_OFFICIELLE',
  MATIERE_UE = 'MATIERE_UE',
  PROJET = 'PROJET',
  CLUB = 'CLUB',
  PRIVE = 'PRIVE',
}

export enum AdhesionMode {
  INVITATION = 'INVITATION',
  CODE = 'CODE',
  DEMANDE = 'DEMANDE',
  OUVERT = 'OUVERT',
}

export enum GroupMemberRole {
  PROPRIETAIRE = 'PROPRIETAIRE',
  MODERATEUR = 'MODERATEUR',
  MEMBRE = 'MEMBRE',
  INVITE = 'INVITE',
}

export enum ChannelType {
  GROUPE = 'GROUPE',
  DIRECT = 'DIRECT',
  ANNONCES = 'ANNONCES',
  RESSOURCES = 'RESSOURCES',
}

export enum MessageType {
  TEXTE = 'TEXTE',
  VOCAL = 'VOCAL',
  FICHIER = 'FICHIER',
  SYSTEME = 'SYSTEME',
}

export enum MeetingStatus {
  PROGRAMMEE = 'PROGRAMMEE',
  EN_COURS = 'EN_COURS',
  TERMINEE = 'TERMINEE',
}

export enum PostType {
  ANNONCE = 'ANNONCE',
  INFORMATION = 'INFORMATION',
  URGENT = 'URGENT',
  EVENEMENT = 'EVENEMENT',
  RESULTAT = 'RESULTAT',
}

export enum PostStatus {
  BROUILLON = 'BROUILLON',
  PUBLIE = 'PUBLIE',
  ARCHIVE = 'ARCHIVE',
}

export enum UEStatus {
  BROUILLON = 'BROUILLON',
  PUBLIEE = 'PUBLIEE',
  EN_COURS = 'EN_COURS',
  TERMINEE = 'TERMINEE',
  ARCHIVEE = 'ARCHIVEE',
}

export enum EvaluationType {
  CONTROLE_CONTINU = 'CONTROLE_CONTINU',
  TP = 'TP',
  EXAMEN = 'EXAMEN',
  RATTRAPAGE = 'RATTRAPAGE',
}

export enum PresenceStatus {
  PRESENT = 'PRESENT',
  ABS = 'ABS',
  DIS = 'DIS',
  ABD = 'ABD',
}

export enum GradePublicationStatus {
  BROUILLON = 'BROUILLON',
  SOUMIS = 'SOUMIS',
  VALIDE = 'VALIDE',
  PUBLIE = 'PUBLIE',
  VERROUILLE = 'VERROUILLE',
}

export enum DecisionUE {
  ADMIS = 'ADMIS',
  AJOURNE = 'AJOURNE',
  RATTRAPAGE = 'RATTRAPAGE',
}

export enum ClaimStatus {
  DEPOSEE = 'DEPOSEE',
  EN_EXAMEN = 'EN_EXAMEN',
  ACCEPTEE = 'ACCEPTEE',
  REFUSEE = 'REFUSEE',
}

export enum RelationType {
  AMI = 'AMI',
  SUIVI = 'SUIVI',
  BLOQUE = 'BLOQUE',
}

export enum RelationStatus {
  EN_ATTENTE = 'EN_ATTENTE',
  ACCEPTE = 'ACCEPTE',
  REFUSE = 'REFUSE',
}

export enum PostAudience {
  PUBLIC = 'PUBLIC',
  AMIS = 'AMIS',
  CLASSE = 'CLASSE',
  GROUPE = 'GROUPE',
  MOI_SEUL = 'MOI_SEUL',
}

export enum AvailabilityStatus {
  DISPONIBLE_GROUPE = 'DISPONIBLE_GROUPE',
  EN_REVISION = 'EN_REVISION',
  EN_STAGE = 'EN_STAGE',
  OCCUPE = 'OCCUPE',
}

export enum ListingCategory {
  LIVRES = 'LIVRES',
  MATERIEL = 'MATERIEL',
  LOGEMENT = 'LOGEMENT',
  COVOITURAGE = 'COVOITURAGE',
  COURS = 'COURS',
  OBJETS_PERDUS = 'OBJETS_PERDUS',
}

export enum ListingStatus {
  ACTIF = 'ACTIF',
  VENDU = 'VENDU',
  EXPIRE = 'EXPIRE',
}

export enum ReportStatus {
  EN_ATTENTE = 'EN_ATTENTE',
  TRAITE = 'TRAITE',
  REJETE = 'REJETE',
}
