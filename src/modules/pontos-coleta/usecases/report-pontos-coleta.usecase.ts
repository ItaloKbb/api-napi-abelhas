import { Inject, Injectable } from '@nestjs/common';
import type { IPontosColetaRepository } from '../repositories/pontos-coleta.repository';

@Injectable()
export class ReportPontosColetaUseCase {
  constructor(
    @Inject('IPontosColetaRepository')
    private readonly repo: IPontosColetaRepository,
  ) {}

  execute(orgId: string) {
    return this.repo.findReport(orgId);
  }
}
