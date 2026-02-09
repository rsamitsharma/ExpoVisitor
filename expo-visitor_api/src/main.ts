import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { ASSETS_CONFIG } from './config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();

  // Serve static files from assets folder
  app.useStaticAssets(ASSETS_CONFIG.STORAGE_PATH, {
    prefix: ASSETS_CONFIG.URL_PREFIX,
  });

  const config = new DocumentBuilder()
    .setTitle('Student Portal API')
    .setDescription('The Student Portal API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
