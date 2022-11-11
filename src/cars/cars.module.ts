import { Module } from '@nestjs/common';
import { CarsController } from "./cars.controller";
import { CarsService } from "./cars.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Car } from './schemas/cars.entity';
import { CarsRepository } from './cars.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Car])
  ],
  controllers: [CarsController],
  providers: [CarsService, CarsRepository]
})
export class CarsModule {}
