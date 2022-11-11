import { pool } from '../database/db';

export class CustomersRepository {
  constructor() {}

  async getAllCustomers() {
    const result = await pool.query(`SELECT * FROM customer`);
    return result?.rows;
  }

  async insertNewCustomer(passport_number: number, username: string, name: string, surname: string, age: number) {
    const result = await pool.query(`
        INSERT 
        INTO customer (passport_number, username, name, surname, age) 
        VALUES (${passport_number}, '${username}', '${name}', '${surname}', ${age});`);

    return result?.command;
  }
}
