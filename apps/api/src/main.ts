import {
  ValidationPipe,
} from '@nestjs/common';
import type {
  ConfigType,
} from '@nestjs/config';
import {
  NestFactory,
} from '@nestjs/core';
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

  const swaggerDescription = [
    'API oficial da Plataforma Higeia.',
    '',
    'A Higeia é uma plataforma SaaS multi-tenant voltada para',
    'nutrição personalizada, gestão clínica, acompanhamento',
    'longitudinal de pacientes, inteligência artificial e',
    'desenvolvimento de gêmeos digitais.',
    '',
    '## Principais recursos',
    '',
    '- Arquitetura multi-tenant com isolamento por organização',
    '- Autenticação JWT com access token e refresh token',
    '- Rotação segura de refresh tokens',
    '- Controle de acesso baseado em perfis (RBAC)',
    '- Gestão de organizações e memberships',
    '- Cadastro e acompanhamento de pacientes',
    '- Prontuários clínicos',
    '- Agendas profissionais e disponibilidade',
    '- Bloqueios de agenda',
    '- Consultas e validação de conflitos',
    '- Rastreamento de requisições e erros padronizados',
    '',
    '## Fluxo de autenticação',
    '',
    '1. Execute `POST /api/auth/login` com e-mail e senha.',
    '2. Copie o `accessToken` inicial retornado.',
    '3. Clique em **Authorize** e informe somente o token JWT.',
    '4. Execute `POST /api/auth/select-organization`.',
    '5. Informe o UUID da organização desejada.',
    '6. Copie o novo `accessToken` contextualizado.',
    '7. Atualize o token no botão **Authorize**.',
    '8. Utilize os endpoints protegidos da organização.',
    '9. Use `POST /api/auth/refresh` quando precisar renovar a sessão.',
    '10. Use `POST /api/auth/logout` ou `/api/auth/logout-all` para encerrar sessões.',
    '',
    '## Contexto multi-tenant',
    '',
    'Os endpoints clínicos utilizam o `organizationId` presente',
    'no access token contextualizado. O usuário só poderá acessar',
    'recursos pertencentes à organização ativa e compatíveis com',
    'o seu perfil de acesso.',
    '',
    '## Autorização',
    '',
    'No botão **Authorize**, informe somente o token JWT.',
    'Não escreva o prefixo `Bearer`, pois ele será acrescentado',
    'automaticamente pela interface.',
  ].join('\n');

  const swaggerConfig =
    new DocumentBuilder()
      .setTitle('Higeia API')
      .setDescription(
        swaggerDescription,
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
          description: [
            'JWT Access Token da Plataforma Higeia.',
            '',
            'Informe somente o token, sem escrever "Bearer".',
            '',
            'Para endpoints multi-tenant, utilize o access token',
            'contextualizado retornado por:',
            '',
            '`POST /api/auth/select-organization`',
          ].join('\n'),
        },
        'access-token',
      )
      .addTag(
        'Authentication',
        'Autenticação, sessões e seleção da organização ativa.',
      )
      .addTag(
        'Organizations',
        'Criação e consulta de organizações da plataforma.',
      )
      .addTag(
        'Patients',
        'Cadastro e gestão de pacientes por organização.',
      )
      .addTag(
        'Medical Records',
        'Prontuários e informações clínicas dos pacientes.',
      )
      .addTag(
        'Appointments',
        'Consultas, agendamentos e conflitos de horário.',
      )
      .addTag(
        'Professional Schedules',
        'Agendas profissionais, janelas de atendimento e bloqueios.',
      )
      .addTag(
        'Health',
        'Verificação do estado operacional da API.',
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
        'Higeia API — Documentação',
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
        defaultModelsExpandDepth: 1,
        defaultModelExpandDepth: 2,
        displayOperationId: false,
      },
    },
  );

  await app.listen(
    config.port,
  );

  logger.log(
    'Higeia API started successfully.',
    {
      context: 'Bootstrap',
      nodeEnv:
        config.nodeEnv,
      port:
        config.port,
      apiPath:
        '/api',
      swaggerPath:
        '/api/docs',
      openApiJsonPath:
        '/api/docs-json',
      openApiYamlPath:
        '/api/docs-yaml',
    },
  );
}

void bootstrap();