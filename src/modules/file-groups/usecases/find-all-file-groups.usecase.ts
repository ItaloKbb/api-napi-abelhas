import { Inject, Injectable } from '@nestjs/common';
import type { IFileGroupsRepository } from '../repositories/file-groups.repository';

@Injectable()
export class FindAllFileGroupsUseCase {
  constructor(
    @Inject('IFileGroupsRepository')
    private readonly repo: IFileGroupsRepository,
  ) {}

  execute(orgId: string) {
    return this.repo.findAll(orgId);
  }
}
