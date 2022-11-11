import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { RentsService } from './rents.service';
import { CreateRentDto } from './dto/create-rent.dto';

@Controller('/rents')
export class RentsController {
  constructor(private rentsService: RentsService) {}

  @Get()
  getAllRents() {
    return this.rentsService.getAll();
  }

  @Get('all/:id')
  getAllRentsByCarId(@Param('id') id: string) {
    return this.rentsService.getAllRentsByCarId(Number(id));
  }


  @Post()
  CreateRent(@Body() createRentDto: CreateRentDto) {
    return this.rentsService.createNewRent(createRentDto)
  }
}
