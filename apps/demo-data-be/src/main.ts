/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger }                         from '@nestjs/common';
import { NestFactory }                    from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app/app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 8888;
  
  const config = new DocumentBuilder()
    .setTitle('ETF search')
    .setDescription(
      'API umożliwiające wyszukiwanie serwisów ETF pozwala użytkownikom na zdalne przeszukiwanie bazy danych funduszy ETF. ' +
      'Z jego pomocą użytkownicy mogą wyszukiwać informacje na temat ETF-ów na podstawie różnych kryteriów, ' +
      'takich jak nazwa funduszu, ticker, rynek docelowy, kategoria, opłaty, historyczne wyniki i inne wskaźniki finansowe. ' +
      'API zwraca odpowiednie dane w formacie JSON, umożliwiając integrację z aplikacjami, platformami inwestycyjnymi lub narzędziami analitycznymi. ' +
      'Dzięki temu, użytkownicy mogą łatwo znaleźć ETF-y spełniające ich specyficzne wymagania inwestycyjne.'
    )
    .setVersion('1.0.0')
    .addTag('ETF')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${ port }/${ globalPrefix }`);
}

bootstrap().catch(console.error);
