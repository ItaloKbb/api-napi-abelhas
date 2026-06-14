import { Inject, Injectable } from '@nestjs/common';
import type { IAnalisesRepository } from '../repositories/analises.repository';
import type { CreateAnaliseDto } from '../dto/create-analise.dto';

@Injectable()
export class CreateAnaliseUseCase {
  constructor(
    @Inject('IAnalisesRepository')
    private readonly repo: IAnalisesRepository,
  ) {}

  execute(dto: CreateAnaliseDto, orgId: string) {
    return this.repo.create(dto, orgId);
  }
}
