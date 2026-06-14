import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import type { IProdutoresRepository } from './produtores.repository';
import type { CreateProdutorDto } from '../dto/create-produtor.dto';
import type { UpdateProdutorDto } from '../dto/update-produtor.dto';

@Injectable()
export class PrismaProdutoresRepository implements IProdutoresRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProdutorDto, orgId: string) {
    return await this.prisma.produtor.create({ data: { ...data, orgId } });
  }

  async findAll(orgId: string) {
    return await this.prisma.produtor.findMany({
      where: { orgId },
      include: { cidade: true },
    });
  }

  async findOne(id: string, orgId: string) {
    return await this.prisma.produtor.findFirst({
      where: { id, orgId },
      include: { cidade: true },
    });
  }

  async update(id: string, data: UpdateProdutorDto, orgId: string) {
    const record = await this.findOne(id, orgId);
    if (!record) return null as never;
    return await this.prisma.produtor.update({ where: { id }, data });
  }

  async remove(id: string, orgId: string) {
    const record = await this.findOne(id, orgId);
    if (!record) return null as never;
    return await this.prisma.produtor.delete({ where: { id } });
  }
}
