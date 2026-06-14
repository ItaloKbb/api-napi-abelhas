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
import { CreateProdutorUseCase } from './usecases/create-produtor.usecase';
import { FindAllProdutoresUseCase } from './usecases/find-all-produtores.usecase';
import { FindOneProdutorUseCase } from './usecases/find-one-produtor.usecase';
import { UpdateProdutorUseCase } from './usecases/update-produtor.usecase';
import { RemoveProdutorUseCase } from './usecases/remove-produtor.usecase';
import {
  createProdutorSchema,
  type CreateProdutorDto,
} from './dto/create-produtor.dto';
import {
  updateProdutorSchema,
  type UpdateProdutorDto,
} from './dto/update-produtor.dto';

@Controller('produtores')
@UseGuards(ClerkAuthGuard, OrgGuard)
export class ProdutoresController {
  constructor(
    private readonly createUseCase: CreateProdutorUseCase,
    private readonly findAllUseCase: FindAllProdutoresUseCase,
    private readonly findOneUseCase: FindOneProdutorUseCase,
    private readonly updateUseCase: UpdateProdutorUseCase,
    private readonly removeUseCase: RemoveProdutorUseCase,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  create(
    @Body(new ZodValidationPipe(createProdutorSchema)) dto: CreateProdutorDto,
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
    @Body(new ZodValidationPipe(updateProdutorSchema)) dto: UpdateProdutorDto,
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
