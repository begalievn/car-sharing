import { HttpException, Injectable, HttpStatus } from "@nestjs/common";
import { AddCustomerDto } from "./dto/add-customer.dto";
import { CustomersRepository } from "./customers.repository";

@Injectable()
export class CustomersService {

  constructor(
    private customersRepository: CustomersRepository
  ) {}

  async getAllCustomers() {
    return await this.customersRepository.getAllCustomers();
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

      return await this.customersRepository.insertNewCustomer(passport_number, username, name, surname, age)
    } catch(e) {
      throw new HttpException('Не верно заполнены поля', HttpStatus.BAD_REQUEST);
    }
  }
}
