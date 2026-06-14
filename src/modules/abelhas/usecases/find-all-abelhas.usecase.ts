import { Inject, Injectable } from '@nestjs/common';
import type { IAbelhasRepository } from '../repositories/abelhas.repository';

@Injectable()
export class FindAllAbelhasUseCase {
  constructor(
    @Inject('IAbelhasRepository')
    private readonly repo: IAbelhasRepository,
  ) {}

  execute() {
    return this.repo.findAll();
  }
}
