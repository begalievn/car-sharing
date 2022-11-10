import { Injectable } from "@nestjs/common";
import { InjectRepository, InjectConnection, InjectDataSource } from "@nestjs/typeorm";
import { Repository, Connection, DataSource } from "typeorm";
import { Statistic } from "./statistics.entity";
import { pool } from "../database/db";


@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Statistic) private statisticsRepository: Repository<Statistic>,
    @InjectConnection() private readonly connection: Connection,
    @InjectDataSource() private dataSource: DataSource
  ) {
  }

  async getAllStatistics() {
    const result = await pool.query(`SELECT *
                                     FROM statistic`);
    return result?.rows;
  }

  async addRentToStatistics(rent) {
    const result = await pool.query(`SELECT *
                                     FROM statistic
                                     WHERE car_id = ${rent.car_id};`);
    const car = result?.rows;
    if (!car[0]) {
      const newCar = {
        car_id: rent.car_id,
        sessions: 1,
        rented_days: rent.rented_days,
        total_income: rent.price,
        average_income: rent.price
      };

      await pool.query(`
          INSERT
          INTO statistic (car_id, sessions, rented_days, total_income, average_income)
          VAlUES (${newCar.car_id}, ${newCar.sessions}, ${newCar.rented_days}, ${newCar.total_income},
                  ${newCar.average_income});`);

      return newCar;
    } else {
      const updateCar = car[0];
      updateCar.sessions += 1;
      updateCar.rented_days += rent.rented_days;
      updateCar.average_income = Math.floor((updateCar.total_income + rent.price) / updateCar.sessions);
      updateCar.total_income += rent.price;
      console.log("Updated Car", updateCar);

      await pool.query(`
          UPDATE statistic
          SET sessions       = ${updateCar.sessions},
              rented_days    = ${updateCar.rented_days},
              average_income = ${updateCar.average_income},
              total_income   = ${updateCar.total_income}
          WHERE car_id = ${updateCar.car_id};
      `);

      return updateCar;
    }
  }
}
