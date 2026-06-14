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
import { CreatePontoColetaUseCase } from './usecases/create-ponto-coleta.usecase';
import { FindAllPontosColetaUseCase } from './usecases/find-all-pontos-coleta.usecase';
import { FindOnePontoColetaUseCase } from './usecases/find-one-ponto-coleta.usecase';
import { UpdatePontoColetaUseCase } from './usecases/update-ponto-coleta.usecase';
import { RemovePontoColetaUseCase } from './usecases/remove-ponto-coleta.usecase';
import {
  createPontoColetaSchema,
  type CreatePontoColetaDto,
} from './dto/create-ponto-coleta.dto';
import {
  updatePontoColetaSchema,
  type UpdatePontoColetaDto,
} from './dto/update-ponto-coleta.dto';

@Controller('pontos-coleta')
@UseGuards(ClerkAuthGuard, OrgGuard)
export class PontosColetaController {
  constructor(
    private readonly createUseCase: CreatePontoColetaUseCase,
    private readonly findAllUseCase: FindAllPontosColetaUseCase,
    private readonly findOneUseCase: FindOnePontoColetaUseCase,
    private readonly updateUseCase: UpdatePontoColetaUseCase,
    private readonly removeUseCase: RemovePontoColetaUseCase,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  create(
    @Body(new ZodValidationPipe(createPontoColetaSchema))
    dto: CreatePontoColetaDto,
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
    @Body(new ZodValidationPipe(updatePontoColetaSchema))
    dto: UpdatePontoColetaDto,
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
