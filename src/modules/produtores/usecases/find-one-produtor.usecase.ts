import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IProdutoresRepository } from '../repositories/produtores.repository';

@Injectable()
export class FindOneProdutorUseCase {
  constructor(
    @Inject('IProdutoresRepository')
    private readonly repo: IProdutoresRepository,
  ) {}

  async execute(id: string, orgId: string) {
    const produtor = await this.repo.findOne(id, orgId);
    if (!produtor) {
      throw new NotFoundException(`Produtor with id ${id} not found`);
    }
    return produtor;
  }
}
