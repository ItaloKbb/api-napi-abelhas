import { Inject, Injectable } from '@nestjs/common';
import type { ITiposAmostraRepository } from '../repositories/tipos-amostra.repository';

@Injectable()
export class FindAllTiposAmostraUseCase {
  constructor(
    @Inject('ITiposAmostraRepository')
    private readonly repo: ITiposAmostraRepository,
  ) {}

  execute() {
    return this.repo.findAll();
  }
}
