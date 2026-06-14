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
import { CreateResponsavelUseCase } from './usecases/create-responsavel.usecase';
import { FindAllResponsaveisUseCase } from './usecases/find-all-responsaveis.usecase';
import { FindOneResponsavelUseCase } from './usecases/find-one-responsavel.usecase';
import { UpdateResponsavelUseCase } from './usecases/update-responsavel.usecase';
import { RemoveResponsavelUseCase } from './usecases/remove-responsavel.usecase';
import {
  createResponsavelSchema,
  type CreateResponsavelDto,
} from './dto/create-responsavel.dto';
import {
  updateResponsavelSchema,
  type UpdateResponsavelDto,
} from './dto/update-responsavel.dto';

@Controller('responsaveis')
@UseGuards(ClerkAuthGuard, OrgGuard)
export class ResponsaveisController {
  constructor(
    private readonly createUseCase: CreateResponsavelUseCase,
    private readonly findAllUseCase: FindAllResponsaveisUseCase,
    private readonly findOneUseCase: FindOneResponsavelUseCase,
    private readonly updateUseCase: UpdateResponsavelUseCase,
    private readonly removeUseCase: RemoveResponsavelUseCase,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  create(
    @Body(new ZodValidationPipe(createResponsavelSchema))
    dto: CreateResponsavelDto,
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
    @Body(new ZodValidationPipe(updateResponsavelSchema))
    dto: UpdateResponsavelDto,
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
}
