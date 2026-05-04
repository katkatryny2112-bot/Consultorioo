import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Habilitar CORS para permitir peticiones desde el frontend (puerto 4200 por defecto en Angular)
  app.enableCors();
  
  // Habilitar validación global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidUnknownValues: false, // Permitir valores desconocidos para evitar errores 400 por metadatos
    transform: true,
    transformOptions: {
      enableImplicitConversion: true, // Auto-convertir tipos (ej: string a number)
    },
  }));

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Consultorio Médico API')
    .setDescription('Documentación interactiva de la API del Portal de Consultorio Médico')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'bearer', // Standard name 'bearer' is often more reliable
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log('Backend running on http://localhost:3000');
  console.log('Swagger documentation available on http://localhost:3000/api');
}
bootstrap();
