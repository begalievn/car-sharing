import { pool } from '../database/db';

export class RentsRepository {
  constructor() {}

  async getAllRents() {
    const result = await pool.query(`
        SELECT *
        FROM rent;`);

    return result?.rows;
  }

  async getAllRentsByCarId(car_id: number) {
    const result = await pool.query(`SELECT *
                                  FROM rent
                                  WHERE car_id = ${car_id}`);
    return result?.rows;
  }

  async deleteRent(rent_id: string) {
    const result = await pool.query(`DELETE FROM rent WHERE rent_id = ${rent_id};`);
    return result?.command;
  }

  async insertIntoRent(customer_id: number, car_id: number, price: number, from_date: Date, till_date: Date) {
    const result = await pool.query(`
          INSERT INTO rent (customer_id, car_id, price, from_date, till_date) VALUES 
          ( ${customer_id}
                 , ${car_id}
                 , ${price}
                 , '${from_date.toISOString()}'
                 , '${till_date.toISOString()}');`);
    return result?.command;
  }
}
