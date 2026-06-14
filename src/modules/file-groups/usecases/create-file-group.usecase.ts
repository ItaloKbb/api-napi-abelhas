import { Inject, Injectable } from '@nestjs/common';
import type { IFileGroupsRepository } from '../repositories/file-groups.repository';
import type { CreateFileGroupDto } from '../dto/create-file-group.dto';

@Injectable()
export class CreateFileGroupUseCase {
  constructor(
    @Inject('IFileGroupsRepository')
    private readonly repo: IFileGroupsRepository,
  ) {}

  execute(dto: CreateFileGroupDto, orgId: string) {
    return this.repo.create(dto, orgId);
  }
}
