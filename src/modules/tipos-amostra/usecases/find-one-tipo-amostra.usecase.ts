import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ITiposAmostraRepository } from '../repositories/tipos-amostra.repository';

@Injectable()
export class FindOneTipoAmostraUseCase {
  constructor(
    @Inject('ITiposAmostraRepository')
    private readonly repo: ITiposAmostraRepository,
  ) {}

  async execute(id: string) {
    const tipoAmostra = await this.repo.findOne(id);
    if (!tipoAmostra) {
      throw new NotFoundException(`Tipo de amostra with id ${id} not found`);
    }
    return tipoAmostra;
  }
}
