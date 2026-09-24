import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Folder, FileItem } from '../../entities';
import { DEFAULT_DEMO_STUDENT_ID } from '../../common/auth-helper';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(Folder) private folderRepo: Repository<Folder>,
    @InjectRepository(FileItem) private fileRepo: Repository<FileItem>,
  ) {}

  async getExplorer(groupeId?: string, parentId?: string) {
    const foldersQb = this.folderRepo
      .createQueryBuilder('f')
      .leftJoinAndSelect('f.files', 'files');

    if (groupeId) {
      foldersQb.where('f.groupeId = :groupeId', { groupeId });
    }
    if (parentId) {
      foldersQb.andWhere('f.parentId = :parentId', { parentId });
    } else {
      foldersQb.andWhere('f.parentId IS NULL');
    }

    const filesQb = this.fileRepo
      .createQueryBuilder('file')
      .leftJoinAndSelect('file.proprietaire', 'proprietaire');

    if (groupeId) {
      filesQb.where('file.groupeId = :groupeId', { groupeId });
    }
    if (parentId) {
      filesQb.andWhere('file.dossierId = :parentId', { parentId });
    }

    const [dossiers, fichiers] = await Promise.all([
      foldersQb.orderBy('f.nom', 'ASC').getMany(),
      filesQb.orderBy('file.createdAt', 'DESC').getMany(),
    ]);

    return { dossiers, fichiers };
  }

  async getAllFolders(groupeId?: string) {
    const qb = this.folderRepo
      .createQueryBuilder('f')
      .leftJoinAndSelect('f.files', 'files');

    if (groupeId) {
      qb.where('f.groupeId = :groupeId', { groupeId });
    }

    return qb.orderBy('f.nom', 'ASC').getMany();
  }

  async getFilesInFolder(folderId: string) {
    return this.fileRepo.find({
      where: { dossierId: folderId },
      relations: { proprietaire: true },
      order: { createdAt: 'DESC' },
    });
  }

  async createFolder(nom: string, groupeId?: string, parentId?: string, proprietaireId?: string) {
    const validOwnerId = (proprietaireId && proprietaireId.length > 20 && proprietaireId !== 'etudiant-demo-id')
      ? proprietaireId
      : DEFAULT_DEMO_STUDENT_ID;

    const folder = this.folderRepo.create({
      nom,
      groupeId,
      parentId,
      proprietaireId: validOwnerId,
    });
    return this.folderRepo.save(folder);
  }

  async createFile(data: Partial<FileItem>) {
    const validOwnerId = (data.proprietaireId && data.proprietaireId.length > 20 && data.proprietaireId !== 'etudiant-demo-id')
      ? data.proprietaireId
      : DEFAULT_DEMO_STUDENT_ID;

    const file = this.fileRepo.create({
      ...data,
      proprietaireId: validOwnerId,
      tailleOctets: data.tailleOctets || (data as any).taille || 1024,
      url: data.url || `/uploads/${data.nom}`,
      cheminStockage: data.cheminStockage || (data as any).chemin || `/storage/${data.nom}`,
    });
    return this.fileRepo.save(file);
  }

  async deleteFile(id: string) {
    const file = await this.fileRepo.findOne({ where: { id } });
    if (!file) throw new NotFoundException('Fichier non trouvé');
    await this.fileRepo.remove(file);
    return { success: true, message: 'Fichier supprimé' };
  }

  async getUploadUrl(fileName: string, typeMime?: string) {
    return {
      uploadUrl: `http://localhost:3000/api/v1/files/upload-direct?file=${encodeURIComponent(fileName)}`,
      fileUrl: `/uploads/${encodeURIComponent(fileName)}`,
      expiresIn: 3600,
    };
  }
}
