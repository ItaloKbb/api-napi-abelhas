import { Inject, Injectable } from '@nestjs/common';
import type { IResponsaveisRepository } from '../repositories/responsaveis.repository';
import type { CreateResponsavelDto } from '../dto/create-responsavel.dto';

@Injectable()
export class CreateResponsavelUseCase {
  constructor(
    @Inject('IResponsaveisRepository')
    private readonly repo: IResponsaveisRepository,
  ) {}

  execute(dto: CreateResponsavelDto, orgId: string) {
    return this.repo.create(dto, orgId);
  }
}
