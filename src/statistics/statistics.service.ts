import { Injectable } from "@nestjs/common";
import { daysInMonth } from "../utils/statistics.helpers";
import { StatisticsRepository } from "./statistics.repository";
import { calculatePrice } from "../utils/rents.helper";


@Injectable()
export class StatisticsService {
  constructor(
    private statisticsRepository: StatisticsRepository,
  ) {
  }

  async getAllStatistics(query) {
    const result = await this.statisticsRepository.getAllStatistics(query);
    return result;
  }

  async addToStatisticsByMonth(rent) {

    if (rent.from_date.getMonth() !== rent.till_date.getMonth()) {
      const carInfoByFirstMonth = await this.statisticsRepository.getCarInfoFromMonthStatistics((rent.car_id), rent.from_date.getMonth() + 1, rent.from_date.getFullYear());
      const rented_days_1 = (carInfoByFirstMonth?.rented_days || 0) + (daysInMonth((rent.from_date.getMonth() + 1), rent.from_date.getFullYear()) - rent.from_date.getDate());
      const firstMonthStatistics = {
        year: rent.from_date.getFullYear(),
        month: rent.from_date.getMonth() + 1,
        car_id: rent.car_id,
        rented_days: Math.abs(rented_days_1),
        total_income: (carInfoByFirstMonth?.total_income || 0) + calculatePrice(rented_days_1),
        average_income: ((carInfoByFirstMonth?.total_income || 0) + rent.price) / Math.abs(rented_days_1),
        sessions: (carInfoByFirstMonth?.sessions || 0) + 1,
        percent_days: Math.floor(rented_days_1 * 100 / daysInMonth(rent.from_date.getMonth() + 1, rent.from_date.getFullYear()))
      };

      if (carInfoByFirstMonth) {
        await this.statisticsRepository.updateMonthStatistic(
          firstMonthStatistics.rented_days,
          firstMonthStatistics.total_income,
          firstMonthStatistics.average_income,
          firstMonthStatistics.sessions,
          firstMonthStatistics.percent_days,
          firstMonthStatistics.car_id,
          firstMonthStatistics.month,
          firstMonthStatistics.year
        )

      } else {
        await this.statisticsRepository.insertIntoMonthStatistic(
          firstMonthStatistics.year, firstMonthStatistics.month,
          firstMonthStatistics.car_id, firstMonthStatistics.rented_days,
          firstMonthStatistics.total_income, firstMonthStatistics.average_income,
          firstMonthStatistics.sessions, firstMonthStatistics.percent_days
        )
      }

      let carInfoBySecondMonth = await this.statisticsRepository.getCarInfoFromMonthStatistics(rent.car_id, rent.till_date.getMonth() + 1, rent.till_date.getFullYear());
      const rented_days_2 = (carInfoBySecondMonth?.rented_days || 0) + rent.till_date.getDate();
      const secondMonthStatistics = {
        year: rent.till_date.getFullYear(),
        month: rent.till_date.getMonth() + 1,
        car_id: rent.car_id,
        rented_days: rented_days_2,
        total_income: (carInfoBySecondMonth?.total_income || 0) + calculatePrice(rented_days_2),
        average_income: ((carInfoBySecondMonth?.total_income || 0) + rent.price) / rented_days_2,
        sessions: (carInfoBySecondMonth?.sessions || 0) + 1,
        percent_days: Math.floor(rented_days_2 * 100 / daysInMonth(rent.till_date.getMonth() + 1, rent.till_date.getFullYear()))
      };

      if (carInfoBySecondMonth) {
        await this.statisticsRepository.updateMonthStatistic(
          secondMonthStatistics.rented_days,
          secondMonthStatistics.total_income,
          secondMonthStatistics.average_income,
          secondMonthStatistics.sessions,
          secondMonthStatistics.percent_days,
          secondMonthStatistics.car_id,
          secondMonthStatistics.month,
          secondMonthStatistics.year
        )
      } else {
        await this.statisticsRepository.insertIntoMonthStatistic(
          secondMonthStatistics.year, secondMonthStatistics.month,
          secondMonthStatistics.car_id, secondMonthStatistics.rented_days,
          secondMonthStatistics.total_income, secondMonthStatistics.average_income,
          secondMonthStatistics.sessions, secondMonthStatistics.percent_days
        )
      }
    } else {

      const carInfoByMonth = await this.statisticsRepository.getCarInfoFromMonthStatistics(rent.car_id, rent.from_date.getMonth() + 1, rent.from_date.getFullYear());
      const rented_days_c = (carInfoByMonth?.rented_days || 0) + rent.till_date.getDate() - rent.from_date.getDate();
      const newStat = {
        year: rent.from_date.getFullYear(),
        month: rent.from_date.getMonth() + 1,
        car_id: rent.car_id,
        rented_days: rented_days_c,
        total_income: (carInfoByMonth?.total_income || 0) + rent.price,
        average_income: ((carInfoByMonth?.total_income || 0) + rent.price) / ((carInfoByMonth?.rented_days || 0) + rent.till_date.getDate() - rent.from_date.getDate()),
        sessions: (carInfoByMonth?.sessions || 0) + 1,
        percent_days: Math.floor(rented_days_c * 100 /  daysInMonth(rent.from_date.getMonth() + 1, rent.from_date.getFullYear()))
      };

      if (carInfoByMonth) {
        await this.statisticsRepository.updateMonthStatistic(
          newStat.rented_days,
          newStat.total_income,
          newStat.average_income,
          newStat.sessions,
          newStat.percent_days,
          newStat.car_id,
          newStat.month,
          newStat.year
        );

      } else {
        await this.statisticsRepository.insertIntoMonthStatistic(
          newStat.year, newStat.month,
          newStat.car_id, newStat.rented_days,
          newStat.total_income, newStat.average_income,
          newStat.sessions, newStat.percent_days
        )
      }
    }
  }

}
