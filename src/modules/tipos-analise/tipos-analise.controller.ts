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
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { CreateTipoAnaliseUseCase } from './usecases/create-tipo-analise.usecase';
import { FindAllTiposAnaliseUseCase } from './usecases/find-all-tipos-analise.usecase';
import { FindOneTipoAnaliseUseCase } from './usecases/find-one-tipo-analise.usecase';
import { UpdateTipoAnaliseUseCase } from './usecases/update-tipo-analise.usecase';
import { RemoveTipoAnaliseUseCase } from './usecases/remove-tipo-analise.usecase';
import {
  createTipoAnaliseSchema,
  type CreateTipoAnaliseDto,
} from './dto/create-tipo-analise.dto';
import {
  updateTipoAnaliseSchema,
  type UpdateTipoAnaliseDto,
} from './dto/update-tipo-analise.dto';

@Controller('tipos-analise')
@UseGuards(ClerkAuthGuard)
export class TiposAnaliseController {
  constructor(
    private readonly createUseCase: CreateTipoAnaliseUseCase,
    private readonly findAllUseCase: FindAllTiposAnaliseUseCase,
    private readonly findOneUseCase: FindOneTipoAnaliseUseCase,
    private readonly updateUseCase: UpdateTipoAnaliseUseCase,
    private readonly removeUseCase: RemoveTipoAnaliseUseCase,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  create(
    @Body(new ZodValidationPipe(createTipoAnaliseSchema))
    dto: CreateTipoAnaliseDto,
  ) {
    return this.createUseCase.execute(dto);
  }

  @Get()
  findAll() {
    return this.findAllUseCase.execute();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findOneUseCase.execute(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateTipoAnaliseSchema))
    dto: UpdateTipoAnaliseDto,
  ) {
    return this.updateUseCase.execute(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.removeUseCase.execute(id);
  }
}
