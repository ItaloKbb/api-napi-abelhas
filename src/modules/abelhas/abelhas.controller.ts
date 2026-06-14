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
import { CreateAbelhaUseCase } from './usecases/create-abelha.usecase';
import { FindAllAbelhasUseCase } from './usecases/find-all-abelhas.usecase';
import { FindOneAbelhaUseCase } from './usecases/find-one-abelha.usecase';
import { UpdateAbelhaUseCase } from './usecases/update-abelha.usecase';
import { RemoveAbelhaUseCase } from './usecases/remove-abelha.usecase';
import {
  createAbelhaSchema,
  type CreateAbelhaDto,
} from './dto/create-abelha.dto';
import {
  updateAbelhaSchema,
  type UpdateAbelhaDto,
} from './dto/update-abelha.dto';

@Controller('abelhas')
@UseGuards(ClerkAuthGuard)
export class AbelhasController {
  constructor(
    private readonly createUseCase: CreateAbelhaUseCase,
    private readonly findAllUseCase: FindAllAbelhasUseCase,
    private readonly findOneUseCase: FindOneAbelhaUseCase,
    private readonly updateUseCase: UpdateAbelhaUseCase,
    private readonly removeUseCase: RemoveAbelhaUseCase,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  create(
    @Body(new ZodValidationPipe(createAbelhaSchema)) dto: CreateAbelhaDto,
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
    @Body(new ZodValidationPipe(updateAbelhaSchema)) dto: UpdateAbelhaDto,
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
