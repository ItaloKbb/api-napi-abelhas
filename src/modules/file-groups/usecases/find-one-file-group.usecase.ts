import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IFileGroupsRepository } from '../repositories/file-groups.repository';

@Injectable()
export class FindOneFileGroupUseCase {
  constructor(
    @Inject('IFileGroupsRepository')
    private readonly repo: IFileGroupsRepository,
  ) {}

  async execute(id: string, orgId: string) {
    const fileGroup = await this.repo.findOne(id, orgId);
    if (!fileGroup) {
      throw new NotFoundException(`FileGroup with id ${id} not found`);
    }
    return fileGroup;
  }
}
