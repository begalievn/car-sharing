import { IsNotEmpty } from 'class-validator';

export class AddCustomerDto {
  @IsNotEmpty()
  passport_number: number;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  surname: string;

  @IsNotEmpty()
  age: number;
}
