import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { Rent } from "./schemas/rents.entity";
import { CreateRentDto } from "./dto/create-rent.dto";
import { StatisticsService } from "../statistics/statistics.service";
import { calculatePrice } from '../utils/rents.helper';
import { RentsRepository } from "./rents.repository";

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
    private statisticsService: StatisticsService,
    private rentsRepository: RentsRepository
  ) {
  }

  async getAll() {
    return await this.rentsRepository.getAllRents();
  }

  async getAllRentsByCarId(car_id: number) {
    return await this.rentsRepository.getAllRentsByCarId(car_id);
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

    newRent.price = calculatePrice(rentedDays);

    const obj = {
      fromDate: new Date(createRentDto.from_date).getDay(),
      tillDate: new Date(createRentDto.till_date).getDay()
    };

    if (obj.fromDate % 6 === 0 || obj.tillDate % 6 === 0) {
      throw new HttpException(`Аренда не может начинаться или заканчиваться на выходной день`, HttpStatus.BAD_REQUEST);
    }

    const allRentsOfCar = await this.getAllRentsByCarId(newRent.car_id);

    /* Code to Delete rents in the past */
    // const currentTime = new Date().getTime();
    // allRentsOfCar.map((rent) => {
    //   const rentTime = new Date(rent.till_date).getTime() + 259200000;
    //   if(rentTime < currentTime) {
    //     this.rentsRepository.deleteRent(rent.rent_id);
    //   }
    // });

    const isAvailable = this.checkIfCarRented(allRentsOfCar, newRent.from_date.getTime(), newRent.till_date.getTime());

    if (isAvailable) {
      await this.statisticsService.addToStatisticsByMonth(newRent);
      return await this.rentsRepository.insertIntoRent(newRent.customer_id, newRent.car_id, newRent.price, newRent.from_date, newRent.till_date);
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
      if (rentedFromTime <= from && from <= rentedTillTime || rentedFromTime <= till + 259200000 && till <= rentedTillTime) {
        condition = false;
      }
    });
    return condition;
  }
}
