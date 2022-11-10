import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customers.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer])
  ],
  controllers: [CustomersController],
  providers: [CustomersService]
})
export class CustomersModule {}
