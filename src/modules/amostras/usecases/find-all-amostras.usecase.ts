import { Inject, Injectable } from '@nestjs/common';
import type { IAmostrasRepository } from '../repositories/amostras.repository';

@Injectable()
export class FindAllAmostrasUseCase {
  constructor(
    @Inject('IAmostrasRepository')
    private readonly repo: IAmostrasRepository,
  ) {}

  execute(orgId: string) {
    return this.repo.findAll(orgId);
  }
}
