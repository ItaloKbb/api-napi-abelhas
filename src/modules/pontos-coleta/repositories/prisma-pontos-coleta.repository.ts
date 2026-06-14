import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import type { IPontosColetaRepository } from './pontos-coleta.repository';
import type { CreatePontoColetaDto } from '../dto/create-ponto-coleta.dto';
import type { UpdatePontoColetaDto } from '../dto/update-ponto-coleta.dto';

@Injectable()
export class PrismaPontosColetaRepository implements IPontosColetaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePontoColetaDto, orgId: string) {
    return await this.prisma.pontoColeta.create({ data: { ...data, orgId } });
  }

  async findAll(orgId: string) {
    return await this.prisma.pontoColeta.findMany({
      where: { orgId },
      include: { cidade: true },
    });
  }

  async findOne(id: string, orgId: string) {
    return await this.prisma.pontoColeta.findFirst({
      where: { id, orgId },
      include: { cidade: true },
    });
  }

  async update(id: string, data: UpdatePontoColetaDto, orgId: string) {
    const record = await this.findOne(id, orgId);
    if (!record) return null as never;
    return await this.prisma.pontoColeta.update({ where: { id }, data });
  }

  async remove(id: string, orgId: string) {
    const record = await this.findOne(id, orgId);
    if (!record) return null as never;
    return await this.prisma.pontoColeta.delete({ where: { id } });
  }
}
