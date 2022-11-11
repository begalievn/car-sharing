import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Statistic } from "./schemas/statistics.entity";
import { StatisticsController } from "./statistics.controller";
import { StatisticsService } from "./statistics.service";
import { StatisticsRepository } from "./statistics.repository";

@Module({
  imports: [],
  controllers: [StatisticsController],
  providers: [StatisticsService, StatisticsRepository],
  exports: [StatisticsService]
})
export class StatisticsModule {
}
