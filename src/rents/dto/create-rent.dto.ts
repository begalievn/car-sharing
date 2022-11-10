import { IsDate } from "class-validator";


export class CreateRentDto {

  readonly customer_id: number;

  readonly car_id: number;

  @IsDate()
  readonly from_date: Date;

  @IsDate()
  readonly till_date: Date;
}
