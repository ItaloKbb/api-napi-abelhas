import { Inject, Injectable } from '@nestjs/common';
import type { ITiposAmostraRepository } from '../repositories/tipos-amostra.repository';
import { FindOneTipoAmostraUseCase } from './find-one-tipo-amostra.usecase';

@Injectable()
export class RemoveTipoAmostraUseCase {
  constructor(
    @Inject('ITiposAmostraRepository')
    private readonly repo: ITiposAmostraRepository,
    private readonly findOne: FindOneTipoAmostraUseCase,
  ) {}

  async execute(id: string) {
    await this.findOne.execute(id);
    return await this.repo.remove(id);
  }
}
