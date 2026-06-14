import { Inject, Injectable } from '@nestjs/common';
import type { IProdutoresRepository } from '../repositories/produtores.repository';
import type { UpdateProdutorDto } from '../dto/update-produtor.dto';
import { FindOneProdutorUseCase } from './find-one-produtor.usecase';

@Injectable()
export class UpdateProdutorUseCase {
  constructor(
    @Inject('IProdutoresRepository')
    private readonly repo: IProdutoresRepository,
    private readonly findOne: FindOneProdutorUseCase,
  ) {}

  async execute(id: string, dto: UpdateProdutorDto, orgId: string) {
    await this.findOne.execute(id, orgId);
    return await this.repo.update(id, dto, orgId);
  }
}
