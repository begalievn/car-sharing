import { HttpException, Injectable, HttpStatus } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './customers.entity';
import { Repository } from 'typeorm';
import { AddCustomerDto } from "./dto/add-customer.dto";
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { pool } from '../database/db';

@Injectable()
export class CustomersService {

  constructor() {}

  async getAllCustomers() {
    const res = await pool.query(`SELECT * FROM customer`);
    return res?.rows;
  }

  async addNewCustomer(addCustomerDto: AddCustomerDto) {
    try {
      const {
        passport_number,
        username,
        name,
        surname,
        age
      } = addCustomerDto;

      await pool.query(`
        INSERT 
        INTO customer (passport_number, username, name, surname, age) 
        VALUES (${passport_number}, '${username}', '${name}', '${surname}', ${age});`);
    } catch(e) {
      throw new HttpException('Не верно заполнены поля', HttpStatus.BAD_REQUEST);
    }
  }
}
