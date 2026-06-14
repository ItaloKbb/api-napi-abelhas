import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ITiposAnaliseRepository } from '../repositories/tipos-analise.repository';

@Injectable()
export class FindOneTipoAnaliseUseCase {
  constructor(
    @Inject('ITiposAnaliseRepository')
    private readonly repo: ITiposAnaliseRepository,
  ) {}

  async execute(id: string) {
    const tipoAnalise = await this.repo.findOne(id);
    if (!tipoAnalise) {
      throw new NotFoundException(`Tipo de análise with id ${id} not found`);
    }
    return tipoAnalise;
  }
}
