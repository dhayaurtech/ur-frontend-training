import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({transform:true, whitelist:true})
  )
  
  app.use(cookieParser())

  const config = new DocumentBuilder()
    .setTitle('Shop Desk Inventory API')
    .setDescription('API for managing products and inventory')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('api/docs',app,document);
    
  app.enableCors({
      origin: 'http://localhost:3000',
      credentials:true
  });
  app.use('/uploads',express.static(join(process.cwd(),"uploads")))
  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
