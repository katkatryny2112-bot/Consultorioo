import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PatientsModule } from './patients/patients.module';
import { SpecialistsModule } from './specialists/specialists.module';
import { AppointmentsModule } from './appointments/appointments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbType = configService.get<string>('DATABASE_TYPE', 'postgres');
        console.log('Database type:', dbType);
        if (dbType === 'postgres') {
          console.log('Host:', configService.get<string>('POSTGRES_HOST'));
          console.log('User:', configService.get<string>('POSTGRES_USER'));
          console.log('DB:', configService.get<string>('POSTGRES_DB'));
        }
        return dbType === 'postgres'
          ? {
            type: 'postgres',
            host: configService.get<string>('POSTGRES_HOST', 'localhost'),
            port: configService.get<number>('POSTGRES_PORT', 5432),
            username: configService.get<string>('POSTGRES_USER', 'consultorio_user'),
            password: configService.get<string>('POSTGRES_PASSWORD', 'consultorio_password'),
            database: configService.get<string>('POSTGRES_DB', 'consultorio_db'),
            autoLoadEntities: true,
            synchronize: true,
          }
          : {
            type: 'sqlite',
            database: 'consultorio.db',
            autoLoadEntities: true,
            synchronize: true,
          };
      },
    }),
    UsersModule,
    AuthModule,
    PatientsModule,
    SpecialistsModule,
    AppointmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
