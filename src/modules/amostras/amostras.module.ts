import { Module } from '@nestjs/common';
import { AmostrasController } from './amostras.controller';
import { CreateAmostraUseCase } from './usecases/create-amostra.usecase';
import { FindAllAmostrasUseCase } from './usecases/find-all-amostras.usecase';
import { FindOneAmostraUseCase } from './usecases/find-one-amostra.usecase';
import { UpdateAmostraUseCase } from './usecases/update-amostra.usecase';
import { RemoveAmostraUseCase } from './usecases/remove-amostra.usecase';
import { PrismaAmostrasRepository } from './repositories/prisma-amostras.repository';

@Module({
  controllers: [AmostrasController],
  providers: [
    CreateAmostraUseCase,
    FindAllAmostrasUseCase,
    FindOneAmostraUseCase,
    UpdateAmostraUseCase,
    RemoveAmostraUseCase,
    { provide: 'IAmostrasRepository', useClass: PrismaAmostrasRepository },
  ],
  exports: [FindOneAmostraUseCase],
})
export class AmostrasModule {}
