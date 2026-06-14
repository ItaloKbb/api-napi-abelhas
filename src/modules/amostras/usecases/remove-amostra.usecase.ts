import { Inject, Injectable } from '@nestjs/common';
import type { IAmostrasRepository } from '../repositories/amostras.repository';
import { FindOneAmostraUseCase } from './find-one-amostra.usecase';

@Injectable()
export class RemoveAmostraUseCase {
  constructor(
    @Inject('IAmostrasRepository')
    private readonly repo: IAmostrasRepository,
    private readonly findOne: FindOneAmostraUseCase,
  ) {}

  async execute(id: string, orgId: string) {
    await this.findOne.execute(id, orgId);
    return await this.repo.remove(id, orgId);
  }
}
