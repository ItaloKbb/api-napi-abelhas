import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IAmostrasRepository } from '../repositories/amostras.repository';

@Injectable()
export class FindOneAmostraUseCase {
  constructor(
    @Inject('IAmostrasRepository')
    private readonly repo: IAmostrasRepository,
  ) {}

  async execute(id: string, orgId: string) {
    const amostra = await this.repo.findOne(id, orgId);
    if (!amostra) {
      throw new NotFoundException(`Amostra with id ${id} not found`);
    }
    return amostra;
  }
}
