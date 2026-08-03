import { ValidationPipe } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';

import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { AppLogger } from './common/logger/app-logger.service';
import { appConfig } from './config/app.config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(
    AppModule,
    {
      bufferLogs: true,
    },
  );

  const logger = app.get(AppLogger);

  app.useLogger(logger);
  app.flushLogs();

  const config =
    app.get<ConfigType<typeof appConfig>>(
      appConfig.KEY,
    );

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: config.webOrigin,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(
    new GlobalExceptionFilter(),
  );

  const swaggerConfig =
    new DocumentBuilder()
      .setTitle('Higeia API')
      .setDescription(
        [
          'API oficial da Plataforma Higeia.',
          '',
          'Plataforma SaaS multi-tenant para nutrição personalizada,',
          'gestão clínica, acompanhamento de pacientes, inteligência',
          'artificial e desenvolvimento de gêmeos digitais.',
          '',
          'Para acessar endpoints protegidos:',
          '1. Faça login em POST /api/auth/login.',
          '2. Selecione a organização em POST /api/auth/select-organization.',
          '3. Copie o accessToken contextualizado.',
          '4. Clique em Authorize e informe o token.',
        ].join('\n'),
      )
      .setVersion('1.0.0')
      .addServer(
        `http://localhost:${config.port}`,
        'Ambiente local',
      )
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description:
            'Informe o access token JWT contextualizado, sem escrever "Bearer".',
        },
        'access-token',
      )
      .build();

  const swaggerDocumentFactory = () =>
    SwaggerModule.createDocument(
      app,
      swaggerConfig,
    );

  SwaggerModule.setup(
    'api/docs',
    app,
    swaggerDocumentFactory,
    {
      customSiteTitle:
        'Higeia API Documentation',
      jsonDocumentUrl:
        'api/docs-json',
      yamlDocumentUrl:
        'api/docs-yaml',
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        tryItOutEnabled: true,
        docExpansion: 'none',
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    },
  );

  await app.listen(config.port);

  logger.log(
    'Higeia API started successfully.',
    {
      context: 'Bootstrap',
      nodeEnv: config.nodeEnv,
      port: config.port,
      path: '/api',
      swaggerPath:
        '/api/docs',
      openApiJsonPath:
        '/api/docs-json',
    },
  );
}

void bootstrap();