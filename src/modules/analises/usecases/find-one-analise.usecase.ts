import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IAnalisesRepository } from '../repositories/analises.repository';

@Injectable()
export class FindOneAnaliseUseCase {
  constructor(
    @Inject('IAnalisesRepository')
    private readonly repo: IAnalisesRepository,
  ) {}

  async execute(id: string, orgId: string) {
    const analise = await this.repo.findOne(id, orgId);
    if (!analise) {
      throw new NotFoundException(`Análise with id ${id} not found`);
    }
    return analise;
  }
}
