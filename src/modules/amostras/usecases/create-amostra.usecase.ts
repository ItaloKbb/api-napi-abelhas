import { Inject, Injectable } from '@nestjs/common';
import type { IAmostrasRepository } from '../repositories/amostras.repository';
import type { CreateAmostraDto } from '../dto/create-amostra.dto';

@Injectable()
export class CreateAmostraUseCase {
  constructor(
    @Inject('IAmostrasRepository')
    private readonly repo: IAmostrasRepository,
  ) {}

  execute(dto: CreateAmostraDto, orgId: string) {
    return this.repo.create(dto, orgId);
  }
}
