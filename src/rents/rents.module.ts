import { Module } from '@nestjs/common';
import { RentsController } from "./rents.controller";
import { RentsService } from "./rents.service";
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rent } from './schemas/rents.entity';
import { StatisticsModule } from '../statistics/statistics.module';
import { RentsRepository } from "./rents.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([Rent]),
    StatisticsModule
  ],
  controllers: [RentsController],
  providers: [RentsService, RentsRepository]
})
export class RentsModule {}
