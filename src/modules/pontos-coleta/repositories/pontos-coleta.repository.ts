import type { PontoColeta } from '@prisma/client';
import type { CreatePontoColetaDto } from '../dto/create-ponto-coleta.dto';
import type { UpdatePontoColetaDto } from '../dto/update-ponto-coleta.dto';

export interface PontoColetaReport {
  id: string;
  nome: string;
  latitude: number;
  longitude: number;
  raio: number | null;
  cidade: string;
  estado: string;
  amostrasMesAtual: number;
  analisesConcluidas: number;
  analisesRejeitadas: number;
}

export interface IPontosColetaRepository {
  create(data: CreatePontoColetaDto, orgId: string): Promise<PontoColeta>;
  findAll(orgId: string): Promise<PontoColeta[]>;
  findReport(orgId: string): Promise<PontoColetaReport[]>;
  findOne(id: string, orgId: string): Promise<PontoColeta | null>;
  update(id: string, data: UpdatePontoColetaDto, orgId: string): Promise<PontoColeta>;
  remove(id: string, orgId: string): Promise<PontoColeta>;
}
