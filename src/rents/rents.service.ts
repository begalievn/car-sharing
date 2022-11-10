import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository, InjectDataSource } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { Rent } from "./rents.entity";
import { CreateRentDto } from "./dto/create-rent.dto";
import { StatisticsService } from "../statistics/statistics.service";
import { pool } from '../database/db';

interface IRent {
  customer_id: number;
  car_id: number;
  price?: number;
  from_date: Date;
  till_date: Date;
}

@Injectable()
export class RentsService {
  constructor(
    @InjectRepository(Rent) private rentRepository: Repository<Rent>,
    @InjectDataSource() private dataSource: DataSource,
    private statisticsService: StatisticsService
  ) {
  }

  async getAll() {
    const result = await pool.query(`
        SELECT *
        FROM rent;`);
    return result?.rows;
  }

  async getAllRentsByCarId(carId: number) {
    const result = await pool.query(`SELECT *
                                  FROM rent
                                  WHERE car_id = ${carId}`);
    return result?.rows;
  }

  async getRentByCarId(car_id: number) {
    const result = await pool.query(`SELECT * FROM rent WHERE car_id = ${car_id} LIMIT 1;`);
    return result?.rows;
  }

  async createNewRent(createRentDto: CreateRentDto) {

    const newRent: IRent = {
      ...createRentDto,
      from_date: new Date(createRentDto.from_date),
      till_date: new Date(createRentDto.till_date)
    };

    const fromDateTime = new Date(newRent.from_date).getTime();
    const tillDateTime = new Date(newRent.till_date).getTime();

    const rentedDays = (tillDateTime - fromDateTime) / 1000 / 60 / 60 / 24;

    if (rentedDays === 0) {
      throw new HttpException("Аренда должна быть не менее 1-го дня", HttpStatus.BAD_REQUEST);
    }

    if (rentedDays < 0) {
      throw new HttpException(`Неверный формат даты`, HttpStatus.BAD_REQUEST);
    }

    if (rentedDays > 30) {
      throw new HttpException(`Аренда не может превышать 30 дней`, HttpStatus.BAD_REQUEST);
    }

    newRent.price = this.calculatePrice(rentedDays);

    const obj = {
      fromDate: new Date(createRentDto.from_date).getDay(),
      tillDate: new Date(createRentDto.till_date).getDay()
    };

    if (obj.fromDate % 6 === 0 || obj.tillDate % 6 === 0) {
      throw new HttpException(`Аренда не может начинаться или заканчиваться на выходной день`, HttpStatus.BAD_REQUEST);
    }

    const allRentsOfCar = await this.getAllRentsByCarId(newRent.car_id);

    const currentTime = new Date().getTime();
    allRentsOfCar.map((rent) => {
      const rentTime = new Date(rent.till_date).getTime() + 259200000;
      if(rentTime < currentTime) {
        console.log(`Rent with id ${rent.rent_id} is in the past`);
        this.dataSource.query(`DELETE FROM rent WHERE rent_id = ${rent.rent_id};`);
      }
    });

    const isAvailable = this.checkIfCarRented(allRentsOfCar, newRent.from_date.getTime(), newRent.till_date.getTime());

    if (isAvailable) {
      await this.statisticsService.addRentToStatistics({...newRent, rented_days: rentedDays});

      const result = await pool.query(`
          INSERT INTO rent (customer_id, car_id, price, from_date, till_date) VALUES 
          ( ${newRent.customer_id}
                 , ${newRent.car_id}
                 , ${newRent.price}
                 , '${newRent.from_date.toISOString()}'
                 , '${newRent.till_date.toISOString()}');`);
      return `Inserted`;
    } else {
      throw new HttpException(`В это время машина в аренде`, HttpStatus.BAD_REQUEST);
    }
  }

  checkIfCarRented(allRentsOfCar: Rent[], from: number, till: number) {
    let condition = true;
    allRentsOfCar.map((rent) => {
      const rentedFromTime = rent.from_date.getTime();
      // Adding 3 days extra
      const rentedTillTime = rent.till_date.getTime() + 259200000;
      if (rentedFromTime <= from && from <= rentedTillTime || rentedFromTime <= till && till <= rentedTillTime) {
        condition = false;
      }
    });
    return condition;
  }

  calculatePrice(days: number) {
    let result = 0;
    let remainingDays = days;

    // first 4 days
    result += remainingDays >= 4 ? 1000 * 4 : (remainingDays % 4) * 1000;
    remainingDays -= 4;

    if (remainingDays <= 0) return result;
    // 5 - 9 days
    result += remainingDays >= 5 ? Math.floor((1000 * 95 / 100)) * 5 : (remainingDays % 5) * Math.floor((1000 * 95 / 100));
    remainingDays -= 5;

    if (remainingDays <= 0) return result;

    // 10 - 17 days
    result += remainingDays >= 8 ? Math.floor((1000 * 90 / 100)) * 8 : (remainingDays % 8) * Math.floor((1000 * 90 / 100));
    remainingDays -= 8;

    if (remainingDays <= 0) return result;

    // 18 - 29
    result += remainingDays * Math.floor((1000 * 85 / 100));
    return result;
  }
}
