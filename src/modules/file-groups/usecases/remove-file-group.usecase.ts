import { Inject, Injectable } from '@nestjs/common';
import type { IFileGroupsRepository } from '../repositories/file-groups.repository';
import { FindOneFileGroupUseCase } from './find-one-file-group.usecase';

@Injectable()
export class RemoveFileGroupUseCase {
  constructor(
    @Inject('IFileGroupsRepository')
    private readonly repo: IFileGroupsRepository,
    private readonly findOne: FindOneFileGroupUseCase,
  ) {}

  async execute(id: string, orgId: string) {
    await this.findOne.execute(id, orgId);
    return await this.repo.remove(id, orgId);
  }
}
