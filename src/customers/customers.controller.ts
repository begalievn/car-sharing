import { Controller, Get, Post, Body } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { AddCustomerDto } from "./dto/add-customer.dto";

@Controller('customers')
export class CustomersController {

  constructor(private readonly customersService: CustomersService) {}

  @Get()
  getAllCustomers() {
    return this.customersService.getAllCustomers();
  }

  @Post()
  addNewCustomer(@Body() addCustomerDto: AddCustomerDto) {
    return this.customersService.addNewCustomer(addCustomerDto);
    const temp=new Date('2015-02-31')
  }
}
