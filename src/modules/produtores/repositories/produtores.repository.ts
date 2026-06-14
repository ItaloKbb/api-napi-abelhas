import type { Produtor } from '@prisma/client';
import type { CreateProdutorDto } from '../dto/create-produtor.dto';
import type { UpdateProdutorDto } from '../dto/update-produtor.dto';

export interface IProdutoresRepository {
  create(data: CreateProdutorDto, orgId: string): Promise<Produtor>;
  findAll(orgId: string): Promise<Produtor[]>;
  findOne(id: string, orgId: string): Promise<Produtor | null>;
  update(id: string, data: UpdateProdutorDto, orgId: string): Promise<Produtor>;
  remove(id: string, orgId: string): Promise<Produtor>;
}
