import { Inject, Injectable } from '@nestjs/common';
import type { IProdutoresRepository } from '../repositories/produtores.repository';

@Injectable()
export class FindAllProdutoresUseCase {
  constructor(
    @Inject('IProdutoresRepository')
    private readonly repo: IProdutoresRepository,
  ) {}

  execute(orgId: string) {
    return this.repo.findAll(orgId);
  }
}
