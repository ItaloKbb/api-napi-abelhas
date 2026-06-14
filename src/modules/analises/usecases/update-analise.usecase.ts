import { Inject, Injectable } from '@nestjs/common';
import type { IAnalisesRepository } from '../repositories/analises.repository';
import type { UpdateAnaliseDto } from '../dto/update-analise.dto';
import { FindOneAnaliseUseCase } from './find-one-analise.usecase';

@Injectable()
export class UpdateAnaliseUseCase {
  constructor(
    @Inject('IAnalisesRepository')
    private readonly repo: IAnalisesRepository,
    private readonly findOne: FindOneAnaliseUseCase,
  ) {}

  async execute(id: string, dto: UpdateAnaliseDto, orgId: string) {
    await this.findOne.execute(id, orgId);
    return await this.repo.update(id, dto, orgId);
  }
}
