import type { Abelha } from '@prisma/client';
import type { CreateAbelhaDto } from '../dto/create-abelha.dto';
import type { UpdateAbelhaDto } from '../dto/update-abelha.dto';

export interface IAbelhasRepository {
  create(data: CreateAbelhaDto): Promise<Abelha>;
  findAll(): Promise<Abelha[]>;
  findOne(id: string): Promise<Abelha | null>;
  update(id: string, data: UpdateAbelhaDto): Promise<Abelha>;
  remove(id: string): Promise<Abelha>;
}
