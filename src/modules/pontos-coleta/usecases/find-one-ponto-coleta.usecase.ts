import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IPontosColetaRepository } from '../repositories/pontos-coleta.repository';

@Injectable()
export class FindOnePontoColetaUseCase {
  constructor(
    @Inject('IPontosColetaRepository')
    private readonly repo: IPontosColetaRepository,
  ) {}

  async execute(id: string, orgId: string) {
    const pontoColeta = await this.repo.findOne(id, orgId);
    if (!pontoColeta) {
      throw new NotFoundException(`Ponto de coleta with id ${id} not found`);
    }
    return pontoColeta;
  }
}
