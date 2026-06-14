import { Inject, Injectable } from '@nestjs/common';
import type { ITiposAnaliseRepository } from '../repositories/tipos-analise.repository';
import type { UpdateTipoAnaliseDto } from '../dto/update-tipo-analise.dto';
import { FindOneTipoAnaliseUseCase } from './find-one-tipo-analise.usecase';

@Injectable()
export class UpdateTipoAnaliseUseCase {
  constructor(
    @Inject('ITiposAnaliseRepository')
    private readonly repo: ITiposAnaliseRepository,
    private readonly findOne: FindOneTipoAnaliseUseCase,
  ) {}

  async execute(id: string, dto: UpdateTipoAnaliseDto) {
    await this.findOne.execute(id);
    return await this.repo.update(id, dto);
  }
}
