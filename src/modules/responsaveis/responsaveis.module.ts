import { Module } from '@nestjs/common';
import { ResponsaveisController } from './responsaveis.controller';
import { CreateResponsavelUseCase } from './usecases/create-responsavel.usecase';
import { FindAllResponsaveisUseCase } from './usecases/find-all-responsaveis.usecase';
import { FindOneResponsavelUseCase } from './usecases/find-one-responsavel.usecase';
import { UpdateResponsavelUseCase } from './usecases/update-responsavel.usecase';
import { RemoveResponsavelUseCase } from './usecases/remove-responsavel.usecase';
import { PrismaResponsaveisRepository } from './repositories/prisma-responsaveis.repository';

@Module({
  controllers: [ResponsaveisController],
  providers: [
    CreateResponsavelUseCase,
    FindAllResponsaveisUseCase,
    FindOneResponsavelUseCase,
    UpdateResponsavelUseCase,
    RemoveResponsavelUseCase,
    {
      provide: 'IResponsaveisRepository',
      useClass: PrismaResponsaveisRepository,
    },
  ],
  exports: [FindOneResponsavelUseCase],
})
export class ResponsaveisModule {}
