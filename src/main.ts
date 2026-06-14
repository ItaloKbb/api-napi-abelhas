import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from '@/app.module';
import { AllExceptionsFilter } from '@/common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    bufferLogs: true,
  });

  const logger = app.get(Logger);
  app.useLogger(logger);

  app.setGlobalPrefix('api/v1');

  app.useGlobalFilters(new AllExceptionsFilter());

  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3001',
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('API NAPI Abelhas')
    .setDescription(
      'API REST para gerenciamento de amostras laboratoriais do NAPI Abelhas (mel, pólen, própolis).',
    )
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}/api/v1`);
  logger.log(`Swagger docs available at: http://localhost:${port}/api/docs`);
}
bootstrap().catch(console.error);
