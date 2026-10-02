import { Inject, Injectable } from '@nestjs/common';
import type { IFileGroupsRepository } from '../repositories/file-groups.repository';
import type { QueryFileGroupsDto } from '../dto/query-file-groups.dto';

@Injectable()
export class FindAllFileGroupsUseCase {
  constructor(
    @Inject('IFileGroupsRepository')
    private readonly repo: IFileGroupsRepository,
  ) {}

  execute(orgId: string, filters?: QueryFileGroupsDto) {
    return this.repo.findAll(orgId, filters);
  }
}
