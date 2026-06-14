import { Inject, Injectable } from '@nestjs/common';
import type { IResponsaveisRepository } from '../repositories/responsaveis.repository';

@Injectable()
export class FindAllResponsaveisUseCase {
  constructor(
    @Inject('IResponsaveisRepository')
    private readonly repo: IResponsaveisRepository,
  ) {}

  execute(orgId: string) {
    return this.repo.findAll(orgId);
  }
}
