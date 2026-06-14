import type { Responsavel } from '@prisma/client';
import type { CreateResponsavelDto } from '../dto/create-responsavel.dto';
import type { UpdateResponsavelDto } from '../dto/update-responsavel.dto';

export interface IResponsaveisRepository {
  create(data: CreateResponsavelDto, orgId: string): Promise<Responsavel>;
  findAll(orgId: string): Promise<Responsavel[]>;
  findOne(id: string, orgId: string): Promise<Responsavel | null>;
  update(id: string, data: UpdateResponsavelDto, orgId: string): Promise<Responsavel>;
  remove(id: string, orgId: string): Promise<Responsavel>;
}
