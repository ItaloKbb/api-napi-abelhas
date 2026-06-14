import { Inject, Injectable } from '@nestjs/common';
import type { ITiposAnaliseRepository } from '../repositories/tipos-analise.repository';
import { FindOneTipoAnaliseUseCase } from './find-one-tipo-analise.usecase';

@Injectable()
export class RemoveTipoAnaliseUseCase {
  constructor(
    @Inject('ITiposAnaliseRepository')
    private readonly repo: ITiposAnaliseRepository,
    private readonly findOne: FindOneTipoAnaliseUseCase,
  ) {}

  async execute(id: string) {
    await this.findOne.execute(id);
    return await this.repo.remove(id);
  }
}
