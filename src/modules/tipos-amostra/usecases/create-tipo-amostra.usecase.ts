import { Inject, Injectable } from '@nestjs/common';
import type { ITiposAmostraRepository } from '../repositories/tipos-amostra.repository';
import type { CreateTipoAmostraDto } from '../dto/create-tipo-amostra.dto';

@Injectable()
export class CreateTipoAmostraUseCase {
  constructor(
    @Inject('ITiposAmostraRepository')
    private readonly repo: ITiposAmostraRepository,
  ) {}

  execute(dto: CreateTipoAmostraDto) {
    return this.repo.create(dto);
  }
}
