import { Inject, Injectable } from '@nestjs/common';
import type { IAmostrasRepository } from '../repositories/amostras.repository';
import type { UpdateAmostraDto } from '../dto/update-amostra.dto';
import { FindOneAmostraUseCase } from './find-one-amostra.usecase';

@Injectable()
export class UpdateAmostraUseCase {
  constructor(
    @Inject('IAmostrasRepository')
    private readonly repo: IAmostrasRepository,
    private readonly findOne: FindOneAmostraUseCase,
  ) {}

  async execute(id: string, dto: UpdateAmostraDto, orgId: string) {
    await this.findOne.execute(id, orgId);
    return await this.repo.update(id, dto, orgId);
  }
}
