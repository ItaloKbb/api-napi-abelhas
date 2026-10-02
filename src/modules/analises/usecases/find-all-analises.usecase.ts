import { Inject, Injectable } from '@nestjs/common';
import type { IAnalisesRepository } from '../repositories/analises.repository';
import type { QueryAnalisesDto } from '../dto/query-analises.dto';

@Injectable()
export class FindAllAnalisesUseCase {
  constructor(
    @Inject('IAnalisesRepository')
    private readonly repo: IAnalisesRepository,
  ) {}

  execute(orgId: string, filters?: QueryAnalisesDto) {
    return this.repo.findAll(orgId, filters);
  }
}
