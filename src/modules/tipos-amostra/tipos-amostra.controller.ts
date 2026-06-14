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
import { CreateTipoAmostraUseCase } from './usecases/create-tipo-amostra.usecase';
import { FindAllTiposAmostraUseCase } from './usecases/find-all-tipos-amostra.usecase';
import { FindOneTipoAmostraUseCase } from './usecases/find-one-tipo-amostra.usecase';
import { UpdateTipoAmostraUseCase } from './usecases/update-tipo-amostra.usecase';
import { RemoveTipoAmostraUseCase } from './usecases/remove-tipo-amostra.usecase';
import {
  createTipoAmostraSchema,
  type CreateTipoAmostraDto,
} from './dto/create-tipo-amostra.dto';
import {
  updateTipoAmostraSchema,
  type UpdateTipoAmostraDto,
} from './dto/update-tipo-amostra.dto';

@Controller('tipos-amostra')
@UseGuards(ClerkAuthGuard)
export class TiposAmostraController {
  constructor(
    private readonly createUseCase: CreateTipoAmostraUseCase,
    private readonly findAllUseCase: FindAllTiposAmostraUseCase,
    private readonly findOneUseCase: FindOneTipoAmostraUseCase,
    private readonly updateUseCase: UpdateTipoAmostraUseCase,
    private readonly removeUseCase: RemoveTipoAmostraUseCase,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  create(
    @Body(new ZodValidationPipe(createTipoAmostraSchema))
    dto: CreateTipoAmostraDto,
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
    @Body(new ZodValidationPipe(updateTipoAmostraSchema))
    dto: UpdateTipoAmostraDto,
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
