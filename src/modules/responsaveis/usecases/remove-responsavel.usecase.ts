import { Inject, Injectable } from '@nestjs/common';
import type { IResponsaveisRepository } from '../repositories/responsaveis.repository';
import { FindOneResponsavelUseCase } from './find-one-responsavel.usecase';

@Injectable()
export class RemoveResponsavelUseCase {
  constructor(
    @Inject('IResponsaveisRepository')
    private readonly repo: IResponsaveisRepository,
    private readonly findOne: FindOneResponsavelUseCase,
  ) {}

  async execute(id: string, orgId: string) {
    await this.findOne.execute(id, orgId);
    return await this.repo.remove(id, orgId);
  }
}
