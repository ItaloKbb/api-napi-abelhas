import { Inject, Injectable } from '@nestjs/common';
import type { IAnalisesRepository } from '../repositories/analises.repository';
import { FindOneAnaliseUseCase } from './find-one-analise.usecase';

@Injectable()
export class RemoveAnaliseUseCase {
  constructor(
    @Inject('IAnalisesRepository')
    private readonly repo: IAnalisesRepository,
    private readonly findOne: FindOneAnaliseUseCase,
  ) {}

  async execute(id: string, orgId: string) {
    await this.findOne.execute(id, orgId);
    return await this.repo.remove(id, orgId);
  }
}
