import { Controller, Get, Param, Query } from '@nestjs/common';
import { StatisticsService } from './statistics.service';


@Controller('statistics')
export class StatisticsController {

  constructor(private statisticsService: StatisticsService) {}

  @Get()
  getAllStatistics(@Query() query) {
    return this.statisticsService.getAllStatistics(query);
  }
}
