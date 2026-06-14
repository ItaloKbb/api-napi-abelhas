import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import type { IAnalisesRepository } from './analises.repository';
import type { CreateAnaliseDto } from '../dto/create-analise.dto';
import type { UpdateAnaliseDto } from '../dto/update-analise.dto';

@Injectable()
export class PrismaAnalisesRepository implements IAnalisesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAnaliseDto, orgId: string) {
    return await this.prisma.analise.create({ data: { ...data, orgId } });
  }

  async findAll(orgId: string) {
    return await this.prisma.analise.findMany({
      where: { orgId },
      include: {
        amostra: true,
        tipoAnalise: true,
        responsavel: true,
      },
    });
  }

  async findOne(id: string, orgId: string) {
    return await this.prisma.analise.findFirst({
      where: { id, orgId },
      include: {
        amostra: true,
        tipoAnalise: true,
        responsavel: true,
      },
    });
  }

  async update(id: string, data: UpdateAnaliseDto, orgId: string) {
    const record = await this.findOne(id, orgId);
    if (!record) return null as never;
    return await this.prisma.analise.update({ where: { id }, data });
  }

  async remove(id: string, orgId: string) {
    const record = await this.findOne(id, orgId);
    if (!record) return null as never;
    return await this.prisma.analise.delete({ where: { id } });
  }
}
