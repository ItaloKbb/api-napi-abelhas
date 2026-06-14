import { Inject, Injectable } from '@nestjs/common';
import type { IPontosColetaRepository } from '../repositories/pontos-coleta.repository';
import type { CreatePontoColetaDto } from '../dto/create-ponto-coleta.dto';

@Injectable()
export class CreatePontoColetaUseCase {
  constructor(
    @Inject('IPontosColetaRepository')
    private readonly repo: IPontosColetaRepository,
  ) {}

  execute(dto: CreatePontoColetaDto, orgId: string) {
    return this.repo.create(dto, orgId);
  }
}
