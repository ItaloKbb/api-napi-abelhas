import { Module } from '@nestjs/common';
import { CidadesIbgeController } from './cidades-ibge.controller';
import { FindAllCidadesIbgeUseCase } from './usecases/find-all-cidades-ibge.usecase';
import { FindOneCidadesIbgeUseCase } from './usecases/find-one-cidades-ibge.usecase';
import { SeedCidadesIbgeUseCase } from './usecases/seed-cidades-ibge.usecase';
import { PrismaCidadesIbgeRepository } from './repositories/prisma-cidades-ibge.repository';

@Module({
  controllers: [CidadesIbgeController],
  providers: [
    FindAllCidadesIbgeUseCase,
    FindOneCidadesIbgeUseCase,
    SeedCidadesIbgeUseCase,
    {
      provide: 'ICidadesIbgeRepository',
      useClass: PrismaCidadesIbgeRepository,
    },
  ],
  exports: [FindOneCidadesIbgeUseCase],
})
export class CidadesIbgeModule {}
