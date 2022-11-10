import { Controller, Post, Get, Body } from '@nestjs/common';
import { AddCarDto } from './dto/cars.dto';
import { CarsService } from './cars.service';

@Controller('/cars')
export class CarsController {

  constructor(private readonly carsService: CarsService) {}

  @Post()
  addCar(@Body() addCarDto: AddCarDto) {
    return this.carsService.addNewCar(addCarDto);
  }

  @Get()
  getAllCars() {
    return this.carsService.getAllCars();
  }
}
