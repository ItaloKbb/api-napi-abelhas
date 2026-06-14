import { Inject, Injectable } from '@nestjs/common';
import type { IAbelhasRepository } from '../repositories/abelhas.repository';
import type { UpdateAbelhaDto } from '../dto/update-abelha.dto';
import { FindOneAbelhaUseCase } from './find-one-abelha.usecase';

@Injectable()
export class UpdateAbelhaUseCase {
  constructor(
    @Inject('IAbelhasRepository')
    private readonly repo: IAbelhasRepository,
    private readonly findOne: FindOneAbelhaUseCase,
  ) {}

  async execute(id: string, dto: UpdateAbelhaDto) {
    await this.findOne.execute(id);
    return await this.repo.update(id, dto);
  }
}
