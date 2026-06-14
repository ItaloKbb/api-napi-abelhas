import { Inject, Injectable } from '@nestjs/common';
import type { IAbelhasRepository } from '../repositories/abelhas.repository';
import type { CreateAbelhaDto } from '../dto/create-abelha.dto';

@Injectable()
export class CreateAbelhaUseCase {
  constructor(
    @Inject('IAbelhasRepository')
    private readonly repo: IAbelhasRepository,
  ) {}

  execute(dto: CreateAbelhaDto) {
    return this.repo.create(dto);
  }
}
