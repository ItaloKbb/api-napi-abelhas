import { Module } from '@nestjs/common';
import { FileGroupsController } from './file-groups.controller';
import { CreateFileGroupUseCase } from './usecases/create-file-group.usecase';
import { FindAllFileGroupsUseCase } from './usecases/find-all-file-groups.usecase';
import { FindOneFileGroupUseCase } from './usecases/find-one-file-group.usecase';
import { UpdateFileGroupUseCase } from './usecases/update-file-group.usecase';
import { RemoveFileGroupUseCase } from './usecases/remove-file-group.usecase';
import { AddFileToGroupUseCase } from './usecases/add-file-to-group.usecase';
import { RemoveFileFromGroupUseCase } from './usecases/remove-file-from-group.usecase';
import { PrismaFileGroupsRepository } from './repositories/prisma-file-groups.repository';

@Module({
  controllers: [FileGroupsController],
  providers: [
    CreateFileGroupUseCase,
    FindAllFileGroupsUseCase,
    FindOneFileGroupUseCase,
    UpdateFileGroupUseCase,
    RemoveFileGroupUseCase,
    AddFileToGroupUseCase,
    RemoveFileFromGroupUseCase,
    {
      provide: 'IFileGroupsRepository',
      useClass: PrismaFileGroupsRepository,
    },
  ],
})
export class FileGroupsModule {}
