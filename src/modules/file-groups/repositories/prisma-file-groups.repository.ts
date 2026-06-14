import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import type { IFileGroupsRepository } from './file-groups.repository';
import type { CreateFileGroupDto } from '../dto/create-file-group.dto';
import type { UpdateFileGroupDto } from '../dto/update-file-group.dto';
import type { AddFileDto } from '../dto/add-file.dto';

@Injectable()
export class PrismaFileGroupsRepository implements IFileGroupsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateFileGroupDto, orgId: string) {
    return await this.prisma.fileGroup.create({ data: { ...data, orgId } });
  }

  async findAll(orgId: string) {
    return await this.prisma.fileGroup.findMany({
      where: { orgId },
      include: { files: true },
    });
  }

  async findOne(id: string, orgId: string) {
    return await this.prisma.fileGroup.findFirst({
      where: { id, orgId },
      include: { files: true },
    });
  }

  async update(id: string, data: UpdateFileGroupDto, orgId: string) {
    const record = await this.findOne(id, orgId);
    if (!record) return null as never;
    return await this.prisma.fileGroup.update({ where: { id }, data });
  }

  async remove(id: string, orgId: string) {
    const record = await this.findOne(id, orgId);
    if (!record) return null as never;
    return await this.prisma.fileGroup.delete({ where: { id } });
  }

  async addFile(fileGroupId: string, data: AddFileDto, orgId: string) {
    const record = await this.findOne(fileGroupId, orgId);
    if (!record) return null as never;
    return await this.prisma.file.create({
      data: { ...data, fileGroupId },
    });
  }

  async removeFile(fileGroupId: string, fileId: string, orgId: string) {
    const record = await this.findOne(fileGroupId, orgId);
    if (!record) return null as never;
    return await this.prisma.file.delete({ where: { id: fileId } });
  }
}
