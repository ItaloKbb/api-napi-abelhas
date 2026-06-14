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
import { CreateAnaliseUseCase } from './usecases/create-analise.usecase';
import { FindAllAnalisesUseCase } from './usecases/find-all-analises.usecase';
import { FindOneAnaliseUseCase } from './usecases/find-one-analise.usecase';
import { UpdateAnaliseUseCase } from './usecases/update-analise.usecase';
import { RemoveAnaliseUseCase } from './usecases/remove-analise.usecase';
import {
  createAnaliseSchema,
  type CreateAnaliseDto,
} from './dto/create-analise.dto';
import {
  updateAnaliseSchema,
  type UpdateAnaliseDto,
} from './dto/update-analise.dto';

@Controller('analises')
@UseGuards(ClerkAuthGuard, OrgGuard)
export class AnalisesController {
  constructor(
    private readonly createUseCase: CreateAnaliseUseCase,
    private readonly findAllUseCase: FindAllAnalisesUseCase,
    private readonly findOneUseCase: FindOneAnaliseUseCase,
    private readonly updateUseCase: UpdateAnaliseUseCase,
    private readonly removeUseCase: RemoveAnaliseUseCase,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  create(
    @Body(new ZodValidationPipe(createAnaliseSchema)) dto: CreateAnaliseDto,
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
    @Body(new ZodValidationPipe(updateAnaliseSchema)) dto: UpdateAnaliseDto,
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
