import { Inject, Injectable } from '@nestjs/common';
import type { ITiposAnaliseRepository } from '../repositories/tipos-analise.repository';

@Injectable()
export class FindAllTiposAnaliseUseCase {
  constructor(
    @Inject('ITiposAnaliseRepository')
    private readonly repo: ITiposAnaliseRepository,
  ) {}

  execute() {
    return this.repo.findAll();
  }
}
