import { Inject, Injectable } from '@nestjs/common';
import type { IPontosColetaRepository } from '../repositories/pontos-coleta.repository';
import type { UpdatePontoColetaDto } from '../dto/update-ponto-coleta.dto';
import { FindOnePontoColetaUseCase } from './find-one-ponto-coleta.usecase';

@Injectable()
export class UpdatePontoColetaUseCase {
  constructor(
    @Inject('IPontosColetaRepository')
    private readonly repo: IPontosColetaRepository,
    private readonly findOne: FindOnePontoColetaUseCase,
  ) {}

  async execute(id: string, dto: UpdatePontoColetaDto, orgId: string) {
    await this.findOne.execute(id, orgId);
    return await this.repo.update(id, dto, orgId);
  }
}
