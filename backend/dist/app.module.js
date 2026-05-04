"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const patients_module_1 = require("./patients/patients.module");
const specialists_module_1 = require("./specialists/specialists.module");
const appointments_module_1 = require("./appointments/appointments.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const dbType = configService.get('DATABASE_TYPE', 'postgres');
                    console.log('Database type:', dbType);
                    if (dbType === 'postgres') {
                        console.log('Host:', configService.get('POSTGRES_HOST'));
                        console.log('User:', configService.get('POSTGRES_USER'));
                        console.log('DB:', configService.get('POSTGRES_DB'));
                    }
                    return dbType === 'postgres'
                        ? {
                            type: 'postgres',
                            host: configService.get('POSTGRES_HOST', 'localhost'),
                            port: configService.get('POSTGRES_PORT', 5432),
                            username: configService.get('POSTGRES_USER', 'consultorio_user'),
                            password: configService.get('POSTGRES_PASSWORD', 'consultorio_password'),
                            database: configService.get('POSTGRES_DB', 'consultorio_db'),
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
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            patients_module_1.PatientsModule,
            specialists_module_1.SpecialistsModule,
            appointments_module_1.AppointmentsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map