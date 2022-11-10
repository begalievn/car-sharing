import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { Car } from './cars.entity';
import { AddCarDto } from './dto/cars.dto';
import { DataSource } from 'typeorm';
import { Connection } from 'typeorm';
import { pool } from '../database/db';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car) private readonly carRepository: Repository<Car>,
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectConnection() private readonly connection: Connection,
  ){}

  async addNewCar(addCarDto: AddCarDto) {
    // const newCar = this.carRepository.create(addCarDto);
    // return this.carRepository.save(newCar);
    // return await this.dataSource.query(`
    //   INSERT INTO car ( model, brand ) VALUES (${addCarDto.model}, ${addCarDto.brand});
    // `)
    // const res = await this.connection.query(`INSERT INTO car (brand, model) VALUES ('${addCarDto.brand}', '${addCarDto.model}');`);
    const res = await pool.query(`INSERT INTO car (brand, model) VALUES ('${addCarDto.brand}', '${addCarDto.model}');`);
    return res;
  }

  async getAllCars() {
    // return this.carRepository.find();
    // return this.dataSource.query(`SELECT * FROM car`);
    const result = await pool.query(`SELECT * FROM car`);
    return result?.rows;
  }
}
