import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from '@/app.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { envSchema } from '@/config/env.schema';
import type { EnvConfig } from '@/config/env.schema';
import { PrismaModule } from '@/prisma/prisma.module';
import { AuthModule } from '@/auth/auth.module';
import { StorageModule } from '@/storage/storage.module';
import { CidadesIbgeModule } from '@/modules/cidades-ibge/cidades-ibge.module';
import { TiposAmostraModule } from '@/modules/tipos-amostra/tipos-amostra.module';
import { TiposAnaliseModule } from '@/modules/tipos-analise/tipos-analise.module';
import { AbelhasModule } from '@/modules/abelhas/abelhas.module';
import { ProdutoresModule } from '@/modules/produtores/produtores.module';
import { ResponsaveisModule } from '@/modules/responsaveis/responsaveis.module';
import { PontosColetaModule } from '@/modules/pontos-coleta/pontos-coleta.module';
import { AmostrasModule } from '@/modules/amostras/amostras.module';
import { AnalisesModule } from '@/modules/analises/analises.module';
import { FileGroupsModule } from '@/modules/file-groups/file-groups.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => envSchema.parse(config),
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvConfig, true>) => {
        const nodeEnv = config.get('NODE_ENV', { infer: true });
        const isProduction = nodeEnv === 'production';

        return {
          pinoHttp: {
            level: config.get('LOG_LEVEL', { infer: true }),
            ...(isProduction
              ? {}
              : {
                  transport: {
                    target: 'pino-pretty',
                    options: {
                      colorize: true,
                      singleLine: true,
                      translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
                    },
                  },
                }),
            redact: {
              paths: [
                'req.headers.authorization',
                'req.headers.cookie',
                'res.headers["set-cookie"]',
              ],
              censor: '[REDACTED]',
            },
          },
        };
      },
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => ({
        ttl: 60000,
      }),
    }),
    PrismaModule,
    AuthModule,
    StorageModule,
    CidadesIbgeModule,
    TiposAmostraModule,
    TiposAnaliseModule,
    AbelhasModule,
    ProdutoresModule,
    ResponsaveisModule,
    PontosColetaModule,
    AmostrasModule,
    AnalisesModule,
    FileGroupsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
