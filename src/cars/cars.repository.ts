import { pool } from '../database/db';

export class CarsRepository {
  constructor() {}

  async getAllCars() {
    const result = await pool.query(`SELECT * FROM car`);
    return result?.rows;
  }

  async insertNewCar(brand: string, model: string) {
    const result = await pool.query(`INSERT INTO car (brand, model) VALUES ('${brand}', '${model}');`);
    return result.command;
  }
}
