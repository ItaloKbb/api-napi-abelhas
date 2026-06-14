import type { TipoAmostra } from '@prisma/client';
import type { CreateTipoAmostraDto } from '../dto/create-tipo-amostra.dto';
import type { UpdateTipoAmostraDto } from '../dto/update-tipo-amostra.dto';

export interface ITiposAmostraRepository {
  create(data: CreateTipoAmostraDto): Promise<TipoAmostra>;
  findAll(): Promise<TipoAmostra[]>;
  findOne(id: string): Promise<TipoAmostra | null>;
  update(id: string, data: UpdateTipoAmostraDto): Promise<TipoAmostra>;
  remove(id: string): Promise<TipoAmostra>;
}
