import { Module } from '@nestjs/common';
import { AnalisesController } from './analises.controller';
import { CreateAnaliseUseCase } from './usecases/create-analise.usecase';
import { FindAllAnalisesUseCase } from './usecases/find-all-analises.usecase';
import { FindOneAnaliseUseCase } from './usecases/find-one-analise.usecase';
import { UpdateAnaliseUseCase } from './usecases/update-analise.usecase';
import { RemoveAnaliseUseCase } from './usecases/remove-analise.usecase';
import { PrismaAnalisesRepository } from './repositories/prisma-analises.repository';

@Module({
  controllers: [AnalisesController],
  providers: [
    CreateAnaliseUseCase,
    FindAllAnalisesUseCase,
    FindOneAnaliseUseCase,
    UpdateAnaliseUseCase,
    RemoveAnaliseUseCase,
    { provide: 'IAnalisesRepository', useClass: PrismaAnalisesRepository },
  ],
  exports: [FindOneAnaliseUseCase],
})
export class AnalisesModule {}
