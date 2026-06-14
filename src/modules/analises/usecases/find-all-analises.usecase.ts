import { Inject, Injectable } from '@nestjs/common';
import type { IAnalisesRepository } from '../repositories/analises.repository';

@Injectable()
export class FindAllAnalisesUseCase {
  constructor(
    @Inject('IAnalisesRepository')
    private readonly repo: IAnalisesRepository,
  ) {}

  execute(orgId: string) {
    return this.repo.findAll(orgId);
  }
}
