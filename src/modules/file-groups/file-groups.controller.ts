import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ClerkAuthGuard } from '@/common/guards/clerk-auth.guard';
import { OrgGuard } from '@/common/guards/org.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { OrgId } from '@/common/decorators/org-id.decorator';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { CreateFileGroupUseCase } from './usecases/create-file-group.usecase';
import { FindAllFileGroupsUseCase } from './usecases/find-all-file-groups.usecase';
import { FindOneFileGroupUseCase } from './usecases/find-one-file-group.usecase';
import { UpdateFileGroupUseCase } from './usecases/update-file-group.usecase';
import { RemoveFileGroupUseCase } from './usecases/remove-file-group.usecase';
import { AddFileToGroupUseCase } from './usecases/add-file-to-group.usecase';
import { RemoveFileFromGroupUseCase } from './usecases/remove-file-from-group.usecase';
import {
  createFileGroupSchema,
  type CreateFileGroupDto,
} from './dto/create-file-group.dto';
import {
  updateFileGroupSchema,
  type UpdateFileGroupDto,
} from './dto/update-file-group.dto';
import { addFileSchema, type AddFileDto } from './dto/add-file.dto';

@Controller('file-groups')
@UseGuards(ClerkAuthGuard, OrgGuard)
export class FileGroupsController {
  constructor(
    private readonly createUseCase: CreateFileGroupUseCase,
    private readonly findAllUseCase: FindAllFileGroupsUseCase,
    private readonly findOneUseCase: FindOneFileGroupUseCase,
    private readonly updateUseCase: UpdateFileGroupUseCase,
    private readonly removeUseCase: RemoveFileGroupUseCase,
    private readonly addFileUseCase: AddFileToGroupUseCase,
    private readonly removeFileUseCase: RemoveFileFromGroupUseCase,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  create(
    @Body(new ZodValidationPipe(createFileGroupSchema))
    dto: CreateFileGroupDto,
    @OrgId() orgId: string,
  ) {
    return this.createUseCase.execute(dto, orgId);
  }

  @Get()
  findAll(@OrgId() orgId: string) {
    return this.findAllUseCase.execute(orgId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @OrgId() orgId: string) {
    return this.findOneUseCase.execute(id, orgId);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateFileGroupSchema))
    dto: UpdateFileGroupDto,
    @OrgId() orgId: string,
  ) {
    return this.updateUseCase.execute(id, dto, orgId);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string, @OrgId() orgId: string) {
    return this.removeUseCase.execute(id, orgId);
  }

  @Post(':id/files')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  addFile(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(addFileSchema)) dto: AddFileDto,
    @OrgId() orgId: string,
  ) {
    return this.addFileUseCase.execute(id, dto, orgId);
  }

  @Delete(':id/files/:fid')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  removeFile(
    @Param('id') id: string,
    @Param('fid') fid: string,
    @OrgId() orgId: string,
  ) {
    return this.removeFileUseCase.execute(id, fid, orgId);
  }
}
