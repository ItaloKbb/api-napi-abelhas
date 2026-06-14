import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IAbelhasRepository } from '../repositories/abelhas.repository';

@Injectable()
export class FindOneAbelhaUseCase {
  constructor(
    @Inject('IAbelhasRepository')
    private readonly repo: IAbelhasRepository,
  ) {}

  async execute(id: string) {
    const abelha = await this.repo.findOne(id);
    if (!abelha) {
      throw new NotFoundException(`Abelha with id ${id} not found`);
    }
    return abelha;
  }
}
