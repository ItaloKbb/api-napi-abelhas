import { Inject, Injectable } from '@nestjs/common';
import type { IProdutoresRepository } from '../repositories/produtores.repository';
import { FindOneProdutorUseCase } from './find-one-produtor.usecase';

@Injectable()
export class RemoveProdutorUseCase {
  constructor(
    @Inject('IProdutoresRepository')
    private readonly repo: IProdutoresRepository,
    private readonly findOne: FindOneProdutorUseCase,
  ) {}

  async execute(id: string, orgId: string) {
    await this.findOne.execute(id, orgId);
    return await this.repo.remove(id, orgId);
  }
}
