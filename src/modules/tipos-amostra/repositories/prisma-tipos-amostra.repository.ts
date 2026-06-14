import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import type { ITiposAmostraRepository } from './tipos-amostra.repository';
import type { CreateTipoAmostraDto } from '../dto/create-tipo-amostra.dto';
import type { UpdateTipoAmostraDto } from '../dto/update-tipo-amostra.dto';

@Injectable()
export class PrismaTiposAmostraRepository implements ITiposAmostraRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTipoAmostraDto) {
    return await this.prisma.tipoAmostra.create({ data });
  }

  async findAll() {
    return await this.prisma.tipoAmostra.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.tipoAmostra.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateTipoAmostraDto) {
    return await this.prisma.tipoAmostra.update({ where: { id }, data });
  }

  async remove(id: string) {
    return await this.prisma.tipoAmostra.delete({ where: { id } });
  }
}
