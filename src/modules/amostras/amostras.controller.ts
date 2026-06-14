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
import { CreateAmostraUseCase } from './usecases/create-amostra.usecase';
import { FindAllAmostrasUseCase } from './usecases/find-all-amostras.usecase';
import { FindOneAmostraUseCase } from './usecases/find-one-amostra.usecase';
import { UpdateAmostraUseCase } from './usecases/update-amostra.usecase';
import { RemoveAmostraUseCase } from './usecases/remove-amostra.usecase';
import {
  createAmostraSchema,
  type CreateAmostraDto,
} from './dto/create-amostra.dto';
import {
  updateAmostraSchema,
  type UpdateAmostraDto,
} from './dto/update-amostra.dto';

@Controller('amostras')
@UseGuards(ClerkAuthGuard, OrgGuard)
export class AmostrasController {
  constructor(
    private readonly createUseCase: CreateAmostraUseCase,
    private readonly findAllUseCase: FindAllAmostrasUseCase,
    private readonly findOneUseCase: FindOneAmostraUseCase,
    private readonly updateUseCase: UpdateAmostraUseCase,
    private readonly removeUseCase: RemoveAmostraUseCase,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  create(
    @Body(new ZodValidationPipe(createAmostraSchema)) dto: CreateAmostraDto,
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
    @Body(new ZodValidationPipe(updateAmostraSchema)) dto: UpdateAmostraDto,
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
