import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import type { IAbelhasRepository } from './abelhas.repository';
import type { CreateAbelhaDto } from '../dto/create-abelha.dto';
import type { UpdateAbelhaDto } from '../dto/update-abelha.dto';

@Injectable()
export class PrismaAbelhasRepository implements IAbelhasRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAbelhaDto) {
    return await this.prisma.abelha.create({ data });
  }

  async findAll() {
    return await this.prisma.abelha.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.abelha.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateAbelhaDto) {
    return await this.prisma.abelha.update({ where: { id }, data });
  }

  async remove(id: string) {
    return await this.prisma.abelha.delete({ where: { id } });
  }
}
