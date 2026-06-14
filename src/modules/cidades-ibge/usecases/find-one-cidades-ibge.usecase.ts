import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ICidadesIbgeRepository } from '../repositories/cidades-ibge.repository';

@Injectable()
export class FindOneCidadesIbgeUseCase {
  constructor(
    @Inject('ICidadesIbgeRepository')
    private readonly repo: ICidadesIbgeRepository,
  ) {}

  async execute(id: string) {
    const cidade = await this.repo.findOne(id);
    if (!cidade) {
      throw new NotFoundException(`Cidade IBGE with id ${id} not found`);
    }
    return cidade;
  }
}
