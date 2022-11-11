import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './customers/customers.module';
import { RentsModule } from "./rents/rents.module";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './cars/schemas/cars.entity';
import { CarsModule } from './cars/cars.module';
import { Customer } from './customers/shemas/customers.entity';
import { Rent } from './rents/schemas/rents.entity';
import { Statistic } from './statistics/schemas/statistics.entity';
import { StatisticsModule } from './statistics/statistics.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [Car, Customer, Rent, Statistic],
        synchronize: true
      }),
      inject: [ConfigService]
    }),
    CustomersModule,
    RentsModule,
    CarsModule,
    StatisticsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
