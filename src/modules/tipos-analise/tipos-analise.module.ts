import { Module } from '@nestjs/common';
import { TiposAnaliseController } from './tipos-analise.controller';
import { CreateTipoAnaliseUseCase } from './usecases/create-tipo-analise.usecase';
import { FindAllTiposAnaliseUseCase } from './usecases/find-all-tipos-analise.usecase';
import { FindOneTipoAnaliseUseCase } from './usecases/find-one-tipo-analise.usecase';
import { UpdateTipoAnaliseUseCase } from './usecases/update-tipo-analise.usecase';
import { RemoveTipoAnaliseUseCase } from './usecases/remove-tipo-analise.usecase';
import { PrismaTiposAnaliseRepository } from './repositories/prisma-tipos-analise.repository';

@Module({
  controllers: [TiposAnaliseController],
  providers: [
    CreateTipoAnaliseUseCase,
    FindAllTiposAnaliseUseCase,
    FindOneTipoAnaliseUseCase,
    UpdateTipoAnaliseUseCase,
    RemoveTipoAnaliseUseCase,
    {
      provide: 'ITiposAnaliseRepository',
      useClass: PrismaTiposAnaliseRepository,
    },
  ],
  exports: [FindOneTipoAnaliseUseCase],
})
export class TiposAnaliseModule {}
