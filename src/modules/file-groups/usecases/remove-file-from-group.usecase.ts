import { Inject, Injectable } from '@nestjs/common';
import type { IFileGroupsRepository } from '../repositories/file-groups.repository';
import { FindOneFileGroupUseCase } from './find-one-file-group.usecase';

@Injectable()
export class RemoveFileFromGroupUseCase {
  constructor(
    @Inject('IFileGroupsRepository')
    private readonly repo: IFileGroupsRepository,
    private readonly findOne: FindOneFileGroupUseCase,
  ) {}

  async execute(fileGroupId: string, fileId: string, orgId: string) {
    await this.findOne.execute(fileGroupId, orgId);
    return await this.repo.removeFile(fileGroupId, fileId, orgId);
  }
}
