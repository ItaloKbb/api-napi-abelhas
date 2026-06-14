import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IResponsaveisRepository } from '../repositories/responsaveis.repository';

@Injectable()
export class FindOneResponsavelUseCase {
  constructor(
    @Inject('IResponsaveisRepository')
    private readonly repo: IResponsaveisRepository,
  ) {}

  async execute(id: string, orgId: string) {
    const responsavel = await this.repo.findOne(id, orgId);
    if (!responsavel) {
      throw new NotFoundException(`Responsável with id ${id} not found`);
    }
    return responsavel;
  }
}
