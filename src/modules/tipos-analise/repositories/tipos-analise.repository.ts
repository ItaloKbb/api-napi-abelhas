import type { TipoAnalise } from '@prisma/client';
import type { CreateTipoAnaliseDto } from '../dto/create-tipo-analise.dto';
import type { UpdateTipoAnaliseDto } from '../dto/update-tipo-analise.dto';

export interface ITiposAnaliseRepository {
  create(data: CreateTipoAnaliseDto): Promise<TipoAnalise>;
  findAll(): Promise<TipoAnalise[]>;
  findOne(id: string): Promise<TipoAnalise | null>;
  update(id: string, data: UpdateTipoAnaliseDto): Promise<TipoAnalise>;
  remove(id: string): Promise<TipoAnalise>;
}
