import { Injectable } from '@nestjs/common';
import type { CidadesIBGE, Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import type { ICidadesIbgeRepository } from './cidades-ibge.repository';
import type { QueryCidadesIbgeDto } from '../dto/query-cidades-ibge.dto';

@Injectable()
export class PrismaCidadesIbgeRepository implements ICidadesIbgeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters?: QueryCidadesIbgeDto): Promise<CidadesIBGE[]> {
    const where: Prisma.CidadesIBGEWhereInput = {};

    if (filters?.estado) {
      where.estado = filters.estado as Prisma.CidadesIBGEWhereInput['estado'];
    }
    if (filters?.regiao) {
      where.regiao = filters.regiao as Prisma.CidadesIBGEWhereInput['regiao'];
    }
    if (filters?.bioma) {
      where.bioma = filters.bioma as Prisma.CidadesIBGEWhereInput['bioma'];
    }

    return await this.prisma.cidadesIBGE.findMany({ where });
  }

  async findOne(id: string): Promise<CidadesIBGE | null> {
    return await this.prisma.cidadesIBGE.findUnique({ where: { id } });
  }

  async count(): Promise<number> {
    return await this.prisma.cidadesIBGE.count();
  }

  async createMany(
    data: Prisma.CidadesIBGECreateManyInput[],
  ): Promise<{ count: number }> {
    return await this.prisma.cidadesIBGE.createMany({ data });
  }
}
