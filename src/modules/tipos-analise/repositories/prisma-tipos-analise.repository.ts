import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import type { ITiposAnaliseRepository } from './tipos-analise.repository';
import type { CreateTipoAnaliseDto } from '../dto/create-tipo-analise.dto';
import type { UpdateTipoAnaliseDto } from '../dto/update-tipo-analise.dto';

@Injectable()
export class PrismaTiposAnaliseRepository implements ITiposAnaliseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTipoAnaliseDto) {
    return await this.prisma.tipoAnalise.create({ data });
  }

  async findAll() {
    return await this.prisma.tipoAnalise.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.tipoAnalise.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateTipoAnaliseDto) {
    return await this.prisma.tipoAnalise.update({ where: { id }, data });
  }

  async remove(id: string) {
    return await this.prisma.tipoAnalise.delete({ where: { id } });
  }
}
