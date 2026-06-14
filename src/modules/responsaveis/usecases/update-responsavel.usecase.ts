import { Inject, Injectable } from '@nestjs/common';
import type { IResponsaveisRepository } from '../repositories/responsaveis.repository';
import type { UpdateResponsavelDto } from '../dto/update-responsavel.dto';
import { FindOneResponsavelUseCase } from './find-one-responsavel.usecase';

@Injectable()
export class UpdateResponsavelUseCase {
  constructor(
    @Inject('IResponsaveisRepository')
    private readonly repo: IResponsaveisRepository,
    private readonly findOne: FindOneResponsavelUseCase,
  ) {}

  async execute(id: string, dto: UpdateResponsavelDto, orgId: string) {
    await this.findOne.execute(id, orgId);
    return await this.repo.update(id, dto, orgId);
  }
}
