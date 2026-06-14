import { Inject, Injectable } from '@nestjs/common';
import type { IPontosColetaRepository } from '../repositories/pontos-coleta.repository';
import { FindOnePontoColetaUseCase } from './find-one-ponto-coleta.usecase';

@Injectable()
export class RemovePontoColetaUseCase {
  constructor(
    @Inject('IPontosColetaRepository')
    private readonly repo: IPontosColetaRepository,
    private readonly findOne: FindOnePontoColetaUseCase,
  ) {}

  async execute(id: string, orgId: string) {
    await this.findOne.execute(id, orgId);
    return await this.repo.remove(id, orgId);
  }
}
