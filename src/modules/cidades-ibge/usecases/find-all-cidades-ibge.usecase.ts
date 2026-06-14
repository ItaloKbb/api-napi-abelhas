import { Inject, Injectable } from '@nestjs/common';
import type { ICidadesIbgeRepository } from '../repositories/cidades-ibge.repository';
import type { QueryCidadesIbgeDto } from '../dto/query-cidades-ibge.dto';

@Injectable()
export class FindAllCidadesIbgeUseCase {
  constructor(
    @Inject('ICidadesIbgeRepository')
    private readonly repo: ICidadesIbgeRepository,
  ) {}

  execute(filters?: QueryCidadesIbgeDto) {
    return this.repo.findAll(filters);
  }
}
