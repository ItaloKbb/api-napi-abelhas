import { Inject, Injectable } from '@nestjs/common';
import type { IProdutoresRepository } from '../repositories/produtores.repository';
import type { CreateProdutorDto } from '../dto/create-produtor.dto';

@Injectable()
export class CreateProdutorUseCase {
  constructor(
    @Inject('IProdutoresRepository')
    private readonly repo: IProdutoresRepository,
  ) {}

  execute(dto: CreateProdutorDto, orgId: string) {
    return this.repo.create(dto, orgId);
  }
}
