import { Module } from '@nestjs/common';
import { RentsController } from "./rents.controller";
import { RentsService } from "./rents.service";
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rent } from './rents.entity';
import { StatisticsModule } from '../statistics/statistics.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rent]),
    StatisticsModule
  ],
  controllers: [RentsController],
  providers: [RentsService]
})
export class RentsModule {}
