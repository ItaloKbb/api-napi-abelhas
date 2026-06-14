import { Inject, Injectable } from '@nestjs/common';
import type { ITiposAmostraRepository } from '../repositories/tipos-amostra.repository';
import type { UpdateTipoAmostraDto } from '../dto/update-tipo-amostra.dto';
import { FindOneTipoAmostraUseCase } from './find-one-tipo-amostra.usecase';

@Injectable()
export class UpdateTipoAmostraUseCase {
  constructor(
    @Inject('ITiposAmostraRepository')
    private readonly repo: ITiposAmostraRepository,
    private readonly findOne: FindOneTipoAmostraUseCase,
  ) {}

  async execute(id: string, dto: UpdateTipoAmostraDto) {
    await this.findOne.execute(id);
    return await this.repo.update(id, dto);
  }
}
