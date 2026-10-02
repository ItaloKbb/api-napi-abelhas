import { Injectable, ServiceUnavailableException, Inject } from '@nestjs/common';
import { Estado, Prisma, Regiao } from '@prisma/client';
import type { ICidadesIbgeRepository } from '../repositories/cidades-ibge.repository';

const IBGE_MUNICIPALITIES_URL =
  'https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome';

const REGION_BY_CODE: Record<string, Regiao> = {
  N: 'NORTE',
  NE: 'NORDESTE',
  CO: 'CENTRO_OESTE',
  SE: 'SUDESTE',
  S: 'SUL',
};

interface IbgeMunicipality {
  id: number;
  nome: string;
  microrregiao?: {
    mesorregiao?: {
      UF?: {
        sigla?: string;
        regiao?: { sigla?: string };
      };
    };
  };
  'regiao-imediata'?: {
    'regiao-intermediaria'?: {
      UF?: {
        sigla?: string;
        regiao?: { sigla?: string };
      };
    };
  };
}

@Injectable()
export class SeedCidadesIbgeUseCase {
  constructor(
    @Inject('ICidadesIbgeRepository')
    private readonly repo: ICidadesIbgeRepository,
  ) {}

  async execute() {
    let response: Response;
    try {
      response = await fetch(IBGE_MUNICIPALITIES_URL, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(30_000),
      });
    } catch {
      throw new ServiceUnavailableException(
        'Não foi possível acessar o serviço de localidades do IBGE.',
      );
    }

    if (!response.ok) {
      throw new ServiceUnavailableException(
        `O serviço de localidades do IBGE respondeu com status ${response.status}.`,
      );
    }

    const municipalities = (await response.json()) as IbgeMunicipality[];
    const data = municipalities.flatMap<Prisma.CidadesIBGECreateManyInput>(
      (municipality) => {
        const uf =
          municipality['regiao-imediata']?.['regiao-intermediaria']?.UF ??
          municipality.microrregiao?.mesorregiao?.UF;
        const region = uf?.regiao?.sigla
          ? REGION_BY_CODE[uf.regiao.sigla]
          : undefined;

        if (!municipality.id || !municipality.nome || !uf?.sigla || !region) {
          return [];
        }

        return [
          {
            codigoIBGE: String(municipality.id),
            cidade: municipality.nome,
            estado: uf.sigla as Estado,
            regiao: region,
            bioma: null,
          },
        ];
      },
    );

    if (data.length === 0) {
      throw new ServiceUnavailableException(
        'O IBGE não retornou municípios válidos para importação.',
      );
    }

    const result = await this.repo.createMany(data);
    return {
      message:
        result.count > 0
          ? `${result.count} município(s) novo(s) importado(s) do IBGE.`
          : 'As cidades já estão sincronizadas com o IBGE.',
      imported: result.count,
      received: data.length,
    };
  }
}
