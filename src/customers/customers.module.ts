import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './shemas/customers.entity';
import { CustomersRepository } from "./customers.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer])
  ],
  controllers: [CustomersController],
  providers: [CustomersService, CustomersRepository]
})
export class CustomersModule {}
