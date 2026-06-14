import { ConflictException, Inject, Injectable } from '@nestjs/common';
import type { ICidadesIbgeRepository } from '../repositories/cidades-ibge.repository';

const DEFAULT_CIDADES = [
  // NORTE
  {
    codigoIBGE: '1302603',
    cidade: 'Manaus',
    estado: 'AM' as const,
    regiao: 'NORTE' as const,
    bioma: 'AMAZONIA' as const,
  },
  {
    codigoIBGE: '1400100',
    cidade: 'Boa Vista',
    estado: 'RR' as const,
    regiao: 'NORTE' as const,
    bioma: 'AMAZONIA' as const,
  },
  {
    codigoIBGE: '1600303',
    cidade: 'Macapá',
    estado: 'AP' as const,
    regiao: 'NORTE' as const,
    bioma: 'AMAZONIA' as const,
  },
  {
    codigoIBGE: '1501402',
    cidade: 'Belém',
    estado: 'PA' as const,
    regiao: 'NORTE' as const,
    bioma: 'AMAZONIA' as const,
  },
  {
    codigoIBGE: '1721000',
    cidade: 'Palmas',
    estado: 'TO' as const,
    regiao: 'NORTE' as const,
    bioma: 'CERRADO' as const,
  },
  {
    codigoIBGE: '1100205',
    cidade: 'Porto Velho',
    estado: 'RO' as const,
    regiao: 'NORTE' as const,
    bioma: 'AMAZONIA' as const,
  },
  {
    codigoIBGE: '1200401',
    cidade: 'Rio Branco',
    estado: 'AC' as const,
    regiao: 'NORTE' as const,
    bioma: 'AMAZONIA' as const,
  },
  // NORDESTE
  {
    codigoIBGE: '2111300',
    cidade: 'São Luís',
    estado: 'MA' as const,
    regiao: 'NORDESTE' as const,
    bioma: 'AMAZONIA' as const,
  },
  {
    codigoIBGE: '2211001',
    cidade: 'Teresina',
    estado: 'PI' as const,
    regiao: 'NORDESTE' as const,
    bioma: 'CAATINGA' as const,
  },
  {
    codigoIBGE: '2304400',
    cidade: 'Fortaleza',
    estado: 'CE' as const,
    regiao: 'NORDESTE' as const,
    bioma: 'CAATINGA' as const,
  },
  {
    codigoIBGE: '2408102',
    cidade: 'Natal',
    estado: 'RN' as const,
    regiao: 'NORDESTE' as const,
    bioma: 'MATA_ATLANTICA' as const,
  },
  {
    codigoIBGE: '2507507',
    cidade: 'João Pessoa',
    estado: 'PB' as const,
    regiao: 'NORDESTE' as const,
    bioma: 'MATA_ATLANTICA' as const,
  },
  {
    codigoIBGE: '2611606',
    cidade: 'Recife',
    estado: 'PE' as const,
    regiao: 'NORDESTE' as const,
    bioma: 'MATA_ATLANTICA' as const,
  },
  {
    codigoIBGE: '2704302',
    cidade: 'Maceió',
    estado: 'AL' as const,
    regiao: 'NORDESTE' as const,
    bioma: 'MATA_ATLANTICA' as const,
  },
  {
    codigoIBGE: '2800308',
    cidade: 'Aracaju',
    estado: 'SE' as const,
    regiao: 'NORDESTE' as const,
    bioma: 'MATA_ATLANTICA' as const,
  },
  {
    codigoIBGE: '2927408',
    cidade: 'Salvador',
    estado: 'BA' as const,
    regiao: 'NORDESTE' as const,
    bioma: 'MATA_ATLANTICA' as const,
  },
  // CENTRO-OESTE
  {
    codigoIBGE: '5300108',
    cidade: 'Brasília',
    estado: 'DF' as const,
    regiao: 'CENTRO_OESTE' as const,
    bioma: 'CERRADO' as const,
  },
  {
    codigoIBGE: '5208707',
    cidade: 'Goiânia',
    estado: 'GO' as const,
    regiao: 'CENTRO_OESTE' as const,
    bioma: 'CERRADO' as const,
  },
  {
    codigoIBGE: '5103403',
    cidade: 'Cuiabá',
    estado: 'MT' as const,
    regiao: 'CENTRO_OESTE' as const,
    bioma: 'CERRADO' as const,
  },
  {
    codigoIBGE: '5002704',
    cidade: 'Campo Grande',
    estado: 'MS' as const,
    regiao: 'CENTRO_OESTE' as const,
    bioma: 'CERRADO' as const,
  },
  // SUDESTE
  {
    codigoIBGE: '3550308',
    cidade: 'São Paulo',
    estado: 'SP' as const,
    regiao: 'SUDESTE' as const,
    bioma: 'MATA_ATLANTICA' as const,
  },
  {
    codigoIBGE: '3304557',
    cidade: 'Rio de Janeiro',
    estado: 'RJ' as const,
    regiao: 'SUDESTE' as const,
    bioma: 'MATA_ATLANTICA' as const,
  },
  {
    codigoIBGE: '3106200',
    cidade: 'Belo Horizonte',
    estado: 'MG' as const,
    regiao: 'SUDESTE' as const,
    bioma: 'CERRADO' as const,
  },
  {
    codigoIBGE: '3205309',
    cidade: 'Vitória',
    estado: 'ES' as const,
    regiao: 'SUDESTE' as const,
    bioma: 'MATA_ATLANTICA' as const,
  },
  // SUL
  {
    codigoIBGE: '4106902',
    cidade: 'Curitiba',
    estado: 'PR' as const,
    regiao: 'SUL' as const,
    bioma: 'MATA_ATLANTICA' as const,
  },
  {
    codigoIBGE: '4205407',
    cidade: 'Florianópolis',
    estado: 'SC' as const,
    regiao: 'SUL' as const,
    bioma: 'MATA_ATLANTICA' as const,
  },
  {
    codigoIBGE: '4314902',
    cidade: 'Porto Alegre',
    estado: 'RS' as const,
    regiao: 'SUL' as const,
    bioma: 'PAMPA' as const,
  },
];

@Injectable()
export class SeedCidadesIbgeUseCase {
  constructor(
    @Inject('ICidadesIbgeRepository')
    private readonly repo: ICidadesIbgeRepository,
  ) {}

  async execute() {
    const count = await this.repo.count();
    if (count > 0) {
      throw new ConflictException(
        'A tabela de cidades IBGE já possui registros.',
      );
    }

    const result = await this.repo.createMany(DEFAULT_CIDADES);
    return { message: `${result.count} cidades cadastradas com sucesso.` };
  }
}
