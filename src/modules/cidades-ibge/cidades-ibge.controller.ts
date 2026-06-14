import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClerkAuthGuard } from '@/common/guards/clerk-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { FindAllCidadesIbgeUseCase } from './usecases/find-all-cidades-ibge.usecase';
import { FindOneCidadesIbgeUseCase } from './usecases/find-one-cidades-ibge.usecase';
import { SeedCidadesIbgeUseCase } from './usecases/seed-cidades-ibge.usecase';
import {
  queryCidadesIbgeSchema,
  type QueryCidadesIbgeDto,
} from './dto/query-cidades-ibge.dto';

@Controller('cidades-ibge')
@UseGuards(ClerkAuthGuard)
export class CidadesIbgeController {
  constructor(
    private readonly findAllUseCase: FindAllCidadesIbgeUseCase,
    private readonly findOneUseCase: FindOneCidadesIbgeUseCase,
    private readonly seedUseCase: SeedCidadesIbgeUseCase,
  ) {}

  @Post('seed')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  seed() {
    return this.seedUseCase.execute();
  }

  @Get()
  findAll(
    @Query(new ZodValidationPipe(queryCidadesIbgeSchema))
    query: QueryCidadesIbgeDto,
  ) {
    return this.findAllUseCase.execute(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findOneUseCase.execute(id);
  }
}
