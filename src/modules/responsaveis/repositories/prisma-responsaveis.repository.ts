import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import type { IResponsaveisRepository } from './responsaveis.repository';
import type { CreateResponsavelDto } from '../dto/create-responsavel.dto';
import type { UpdateResponsavelDto } from '../dto/update-responsavel.dto';

@Injectable()
export class PrismaResponsaveisRepository implements IResponsaveisRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateResponsavelDto, orgId: string) {
    return await this.prisma.responsavel.create({ data: { ...data, orgId } });
  }

  async findAll(orgId: string) {
    return await this.prisma.responsavel.findMany({
      where: { orgId },
      include: { cidade: true },
    });
  }

  async findOne(id: string, orgId: string) {
    return await this.prisma.responsavel.findFirst({
      where: { id, orgId },
      include: { cidade: true },
    });
  }

  async update(id: string, data: UpdateResponsavelDto, orgId: string) {
    const record = await this.findOne(id, orgId);
    if (!record) return null as never;
    return await this.prisma.responsavel.update({ where: { id }, data });
  }

  async remove(id: string, orgId: string) {
    const record = await this.findOne(id, orgId);
    if (!record) return null as never;
    return await this.prisma.responsavel.delete({ where: { id } });
  }
}
