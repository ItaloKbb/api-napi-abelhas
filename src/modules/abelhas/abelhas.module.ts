import { Module } from '@nestjs/common';
import { AbelhasController } from './abelhas.controller';
import { CreateAbelhaUseCase } from './usecases/create-abelha.usecase';
import { FindAllAbelhasUseCase } from './usecases/find-all-abelhas.usecase';
import { FindOneAbelhaUseCase } from './usecases/find-one-abelha.usecase';
import { UpdateAbelhaUseCase } from './usecases/update-abelha.usecase';
import { RemoveAbelhaUseCase } from './usecases/remove-abelha.usecase';
import { PrismaAbelhasRepository } from './repositories/prisma-abelhas.repository';

@Module({
  controllers: [AbelhasController],
  providers: [
    CreateAbelhaUseCase,
    FindAllAbelhasUseCase,
    FindOneAbelhaUseCase,
    UpdateAbelhaUseCase,
    RemoveAbelhaUseCase,
    { provide: 'IAbelhasRepository', useClass: PrismaAbelhasRepository },
  ],
  exports: [FindOneAbelhaUseCase],
})
export class AbelhasModule {}
