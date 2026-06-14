import { Inject, Injectable } from '@nestjs/common';
import type { IFileGroupsRepository } from '../repositories/file-groups.repository';
import type { AddFileDto } from '../dto/add-file.dto';
import { FindOneFileGroupUseCase } from './find-one-file-group.usecase';

@Injectable()
export class AddFileToGroupUseCase {
  constructor(
    @Inject('IFileGroupsRepository')
    private readonly repo: IFileGroupsRepository,
    private readonly findOne: FindOneFileGroupUseCase,
  ) {}

  async execute(fileGroupId: string, dto: AddFileDto, orgId: string) {
    await this.findOne.execute(fileGroupId, orgId);
    return await this.repo.addFile(fileGroupId, dto, orgId);
  }
}
