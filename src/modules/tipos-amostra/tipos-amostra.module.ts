import { Module } from '@nestjs/common';
import { TiposAmostraController } from './tipos-amostra.controller';
import { CreateTipoAmostraUseCase } from './usecases/create-tipo-amostra.usecase';
import { FindAllTiposAmostraUseCase } from './usecases/find-all-tipos-amostra.usecase';
import { FindOneTipoAmostraUseCase } from './usecases/find-one-tipo-amostra.usecase';
import { UpdateTipoAmostraUseCase } from './usecases/update-tipo-amostra.usecase';
import { RemoveTipoAmostraUseCase } from './usecases/remove-tipo-amostra.usecase';
import { PrismaTiposAmostraRepository } from './repositories/prisma-tipos-amostra.repository';

@Module({
  controllers: [TiposAmostraController],
  providers: [
    CreateTipoAmostraUseCase,
    FindAllTiposAmostraUseCase,
    FindOneTipoAmostraUseCase,
    UpdateTipoAmostraUseCase,
    RemoveTipoAmostraUseCase,
    {
      provide: 'ITiposAmostraRepository',
      useClass: PrismaTiposAmostraRepository,
    },
  ],
  exports: [FindOneTipoAmostraUseCase],
})
export class TiposAmostraModule {}
