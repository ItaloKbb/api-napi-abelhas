import type { CidadesIBGE, Prisma } from '@prisma/client';
import type { QueryCidadesIbgeDto } from '../dto/query-cidades-ibge.dto';

export interface ICidadesIbgeRepository {
  findAll(filters?: QueryCidadesIbgeDto): Promise<CidadesIBGE[]>;
  findOne(id: string): Promise<CidadesIBGE | null>;
  count(): Promise<number>;
  createMany(
    data: Prisma.CidadesIBGECreateManyInput[],
  ): Promise<{ count: number }>;
}
