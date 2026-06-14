import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import type { IAmostrasRepository } from './amostras.repository';
import type { CreateAmostraDto } from '../dto/create-amostra.dto';
import type { UpdateAmostraDto } from '../dto/update-amostra.dto';

@Injectable()
export class PrismaAmostrasRepository implements IAmostrasRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAmostraDto, orgId: string) {
    return await this.prisma.amostra.create({ data: { ...data, orgId } });
  }

  async findAll(orgId: string) {
    return await this.prisma.amostra.findMany({
      where: { orgId },
      include: {
        pontoColeta: true,
        abelha: true,
        produtor: true,
        tipoAmostra: true,
      },
    });
  }

  async findOne(id: string, orgId: string) {
    return await this.prisma.amostra.findFirst({
      where: { id, orgId },
      include: {
        pontoColeta: true,
        abelha: true,
        produtor: true,
        tipoAmostra: true,
      },
    });
  }

  async update(id: string, data: UpdateAmostraDto, orgId: string) {
    const record = await this.findOne(id, orgId);
    if (!record) return null as never;
    return await this.prisma.amostra.update({ where: { id }, data });
  }

  async remove(id: string, orgId: string) {
    const record = await this.findOne(id, orgId);
    if (!record) return null as never;
    return await this.prisma.amostra.delete({ where: { id } });
  }
}
