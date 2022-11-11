import { Injectable } from '@nestjs/common';
import { AddCarDto } from './dto/cars.dto';
import { pool } from '../database/db';
import { CarsRepository } from "./cars.repository";

@Injectable()
export class CarsService {
  constructor(
    private carsRepository: CarsRepository
  ){}

  async addNewCar(addCarDto: AddCarDto) {
    return await this.carsRepository.insertNewCar(addCarDto.brand, addCarDto.model);
  }

  async getAllCars() {
    return await this.carsRepository.getAllCars();
  }
}
