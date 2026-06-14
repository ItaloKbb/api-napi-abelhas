import type { Amostra } from '@prisma/client';
import type { CreateAmostraDto } from '../dto/create-amostra.dto';
import type { UpdateAmostraDto } from '../dto/update-amostra.dto';

export interface IAmostrasRepository {
  create(data: CreateAmostraDto, orgId: string): Promise<Amostra>;
  findAll(orgId: string): Promise<Amostra[]>;
  findOne(id: string, orgId: string): Promise<Amostra | null>;
  update(id: string, data: UpdateAmostraDto, orgId: string): Promise<Amostra>;
  remove(id: string, orgId: string): Promise<Amostra>;
}
