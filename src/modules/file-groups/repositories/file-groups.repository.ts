import type { FileGroup, File } from '@prisma/client';
import type { CreateFileGroupDto } from '../dto/create-file-group.dto';
import type { UpdateFileGroupDto } from '../dto/update-file-group.dto';
import type { AddFileDto } from '../dto/add-file.dto';

export interface IFileGroupsRepository {
  create(data: CreateFileGroupDto, orgId: string): Promise<FileGroup>;
  findAll(orgId: string): Promise<FileGroup[]>;
  findOne(id: string, orgId: string): Promise<(FileGroup & { files: File[] }) | null>;
  update(id: string, data: UpdateFileGroupDto, orgId: string): Promise<FileGroup>;
  remove(id: string, orgId: string): Promise<FileGroup>;
  addFile(fileGroupId: string, data: AddFileDto, orgId: string): Promise<File>;
  removeFile(fileGroupId: string, fileId: string, orgId: string): Promise<File>;
}
