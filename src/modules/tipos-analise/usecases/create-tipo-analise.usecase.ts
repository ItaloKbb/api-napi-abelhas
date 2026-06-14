import { Inject, Injectable } from '@nestjs/common';
import type { ITiposAnaliseRepository } from '../repositories/tipos-analise.repository';
import type { CreateTipoAnaliseDto } from '../dto/create-tipo-analise.dto';

@Injectable()
export class CreateTipoAnaliseUseCase {
  constructor(
    @Inject('ITiposAnaliseRepository')
    private readonly repo: ITiposAnaliseRepository,
  ) {}

  execute(dto: CreateTipoAnaliseDto) {
    return this.repo.create(dto);
  }
}
