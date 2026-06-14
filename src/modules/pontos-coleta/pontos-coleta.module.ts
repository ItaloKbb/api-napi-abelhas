import { Module } from '@nestjs/common';
import { PontosColetaController } from './pontos-coleta.controller';
import { CreatePontoColetaUseCase } from './usecases/create-ponto-coleta.usecase';
import { FindAllPontosColetaUseCase } from './usecases/find-all-pontos-coleta.usecase';
import { FindOnePontoColetaUseCase } from './usecases/find-one-ponto-coleta.usecase';
import { UpdatePontoColetaUseCase } from './usecases/update-ponto-coleta.usecase';
import { RemovePontoColetaUseCase } from './usecases/remove-ponto-coleta.usecase';
import { PrismaPontosColetaRepository } from './repositories/prisma-pontos-coleta.repository';

@Module({
  controllers: [PontosColetaController],
  providers: [
    CreatePontoColetaUseCase,
    FindAllPontosColetaUseCase,
    FindOnePontoColetaUseCase,
    UpdatePontoColetaUseCase,
    RemovePontoColetaUseCase,
    {
      provide: 'IPontosColetaRepository',
      useClass: PrismaPontosColetaRepository,
    },
  ],
  exports: [FindOnePontoColetaUseCase],
})
export class PontosColetaModule {}
