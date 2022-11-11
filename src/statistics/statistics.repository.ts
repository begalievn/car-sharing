import { pool } from "../database/db";

export class StatisticsRepository {
  constructor() {
  }

  async getAllStatistics(query) {

    if (query?.month && query?.car_id) {
      const result = await pool.query(`SELECT *
                                       FROM month_statistic
                                       WHERE month = ${query.month}
                                         AND car_id = ${query.car_id};`);
      return result?.rows;
    }

    if (query?.car_id) {
      const result = await pool.query(`SELECT *
                                       FROM month_statistic
                                       WHERE car_id = ${query.car_id};`);
      return result?.rows;
    }

    if (query?.month) {
      const result = await pool.query(`SELECT *
                                       FROM month_statistic
                                       WHERE month = ${query.month};`);
      return result?.rows;
    }

    const result = await pool.query(`SELECT *
                                     FROM month_statistic
                                     ORDER BY year, month ASC`);
    return result?.rows;
  }

  async getCarInfoFromMonthStatistics(car_id, month, year) {
    const result = await pool.query(`
          SELECT *
          FROM month_statistic
          WHERE month = ${month}
            AND year = ${year}
            AND car_id = ${car_id}`);

    return result?.rows[0];
  }

  async updateMonthStatistic(
    rented_days: number,
    total_income: number,
    average_income: number,
    sessions: number,
    percent_days: number,
    car_id: number,
    month: number,
    year: number
  ) {
    await pool.query(`UPDATE month_statistic
                          SET rented_days    = ${rented_days},
                              total_income   = ${total_income},
                              average_income = ${average_income},
                              sessions       = ${sessions},
                              percent_days   = ${percent_days}
                          WHERE month = ${month}
                            AND car_id = ${car_id}
                            AND year = ${year};`);
  }

  async insertIntoMonthStatistic(
    year: number, month: number,
    car_id: number, rented_days: number,
    total_income: number, average_income: number,
    sessions: number, percent_days: number
  ) {
    await pool.query(`INSERT INTO month_statistic (year, month, car_id, rented_days, total_income,
                                                       average_income, sessions, percent_days)
                          VALUES (${year}, ${month},
                                  ${car_id},
                                  ${rented_days}, ${total_income},
                                  ${average_income}, ${sessions},
                                  ${percent_days})
        `);
  }

  async addRentToStatistic(car_id) {
  }


}

