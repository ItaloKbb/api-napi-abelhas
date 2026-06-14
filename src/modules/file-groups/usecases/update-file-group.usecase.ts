import { Inject, Injectable } from '@nestjs/common';
import type { IFileGroupsRepository } from '../repositories/file-groups.repository';
import type { UpdateFileGroupDto } from '../dto/update-file-group.dto';
import { FindOneFileGroupUseCase } from './find-one-file-group.usecase';

@Injectable()
export class UpdateFileGroupUseCase {
  constructor(
    @Inject('IFileGroupsRepository')
    private readonly repo: IFileGroupsRepository,
    private readonly findOne: FindOneFileGroupUseCase,
  ) {}

  async execute(id: string, dto: UpdateFileGroupDto, orgId: string) {
    await this.findOne.execute(id, orgId);
    return await this.repo.update(id, dto, orgId);
  }
}
