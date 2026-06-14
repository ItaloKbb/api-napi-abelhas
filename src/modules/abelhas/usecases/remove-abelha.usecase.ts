import { Inject, Injectable } from '@nestjs/common';
import type { IAbelhasRepository } from '../repositories/abelhas.repository';
import { FindOneAbelhaUseCase } from './find-one-abelha.usecase';

@Injectable()
export class RemoveAbelhaUseCase {
  constructor(
    @Inject('IAbelhasRepository')
    private readonly repo: IAbelhasRepository,
    private readonly findOne: FindOneAbelhaUseCase,
  ) {}

  async execute(id: string) {
    await this.findOne.execute(id);
    return await this.repo.remove(id);
  }
}
