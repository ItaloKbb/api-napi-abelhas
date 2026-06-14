import { Module } from '@nestjs/common';
import { ProdutoresController } from './produtores.controller';
import { CreateProdutorUseCase } from './usecases/create-produtor.usecase';
import { FindAllProdutoresUseCase } from './usecases/find-all-produtores.usecase';
import { FindOneProdutorUseCase } from './usecases/find-one-produtor.usecase';
import { UpdateProdutorUseCase } from './usecases/update-produtor.usecase';
import { RemoveProdutorUseCase } from './usecases/remove-produtor.usecase';
import { PrismaProdutoresRepository } from './repositories/prisma-produtores.repository';

@Module({
  controllers: [ProdutoresController],
  providers: [
    CreateProdutorUseCase,
    FindAllProdutoresUseCase,
    FindOneProdutorUseCase,
    UpdateProdutorUseCase,
    RemoveProdutorUseCase,
    {
      provide: 'IProdutoresRepository',
      useClass: PrismaProdutoresRepository,
    },
  ],
  exports: [FindOneProdutorUseCase],
})
export class ProdutoresModule {}
