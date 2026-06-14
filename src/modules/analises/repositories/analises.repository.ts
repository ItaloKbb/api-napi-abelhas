import type { Analise } from '@prisma/client';
import type { CreateAnaliseDto } from '../dto/create-analise.dto';
import type { UpdateAnaliseDto } from '../dto/update-analise.dto';

export interface IAnalisesRepository {
  create(data: CreateAnaliseDto, orgId: string): Promise<Analise>;
  findAll(orgId: string): Promise<Analise[]>;
  findOne(id: string, orgId: string): Promise<Analise | null>;
  update(id: string, data: UpdateAnaliseDto, orgId: string): Promise<Analise>;
  remove(id: string, orgId: string): Promise<Analise>;
}
